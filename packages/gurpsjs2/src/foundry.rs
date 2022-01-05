pub mod bindings;

use bevy::prelude::*;
use std::cell::RefCell;
use wasm_bindgen::JsCast;
pub use {bindings::FoundryEvent, bindings::Hook};

pub struct FoundryPlugin;

impl Plugin for FoundryPlugin {
    fn build(&self, app: &mut App) {
        app.init_resource::<Foundry>()
            .add_event::<FoundryEvent>()
            .add_system(proxy_foundry_events.exclusive_system())
            .add_system(sync_ui_state.exclusive_system());
    }
}

pub struct Foundry {
    _hooks: Vec<Hook>,
    pub game: bindings::Game,
}

thread_local! {
    static FOUNDRY_EVENT_BUFFER: RefCell<Vec<bindings::FoundryEvent>> = RefCell::new(vec![]);
}

impl Foundry {
    pub fn iter_actors(&self) -> impl Iterator<Item = bindings::Actor> {
        self.game
            .actors()
            .values()
            .into_iter()
            .map(|js_value| js_value.unwrap().unchecked_into::<bindings::Actor>())
    }
    pub fn iter_items(&self) -> impl Iterator<Item = bindings::Item> {
        self.game
            .items()
            .values()
            .into_iter()
            .map(|js_value| js_value.unwrap().unchecked_into::<bindings::Item>())
    }
    pub fn iter_entities(&self) -> impl Iterator<Item = bindings::Document> {
        self.game
            .items()
            .values()
            .into_iter()
            .chain(self.game.actors().values().into_iter())
            .map(|js_value| js_value.unwrap().unchecked_into::<bindings::Document>())
    }
}
unsafe impl Send for Foundry {}
unsafe impl Sync for Foundry {}

impl FromWorld for Foundry {
    fn from_world(world: &mut World) -> Self {
        let hooks = bindings::FoundryEvent::HOOKS
            .iter()
            .map(|hook| {
                Hook::simple(hook.to_string(), |arg1, arg2, arg3| {
                    FOUNDRY_EVENT_BUFFER.with(|foundry_events| {
                        let mut foundry_events = foundry_events.borrow_mut();
                        foundry_events.push(bindings::FoundryEvent::create(hook, arg1, arg2, arg3));
                    });
                })
            })
            .collect();
        Foundry {
            _hooks: hooks,
            game: bindings::game(),
        }
    }
}

#[derive(Component)]
pub struct FoundryEntity {
    id: String,
}
#[derive(Component)]
pub struct FoundryActor;
#[derive(Component)]
pub struct FoundryItem;
#[derive(Component)]
pub struct FoundryApplication {
    id: u32,
}
#[derive(Component)]
pub struct OpenFoundryApplication;
#[derive(Component)]
pub struct ClosedFoundryApplication;
#[derive(Component)]
pub struct FoundryActorSheet;
#[derive(Component)]
pub struct FoundryItemSheet;

fn sync_ui_state(
    mut commands: Commands,
    mut events: EventReader<FoundryEvent>,
    apps: Query<(Entity, &FoundryApplication)>,
) {
    for e in events.iter() {
        match e {
            FoundryEvent::RenderActorSheet(actor_sheet, _, _) => {
                if let Some((entity, _)) =
                    apps.iter().find(|(_, app)| app.id == actor_sheet.app_id())
                {
                    commands
                        .entity(entity)
                        .remove::<ClosedFoundryApplication>()
                        .insert(OpenFoundryApplication);
                } else {
                    commands
                        .spawn()
                        .insert(FoundryApplication {
                            id: actor_sheet.app_id(),
                        })
                        .insert(OpenFoundryApplication);
                }
            }
            FoundryEvent::CloseActorSheet(actor_sheet, _, _) => {
                if let Some((entity, _)) =
                    apps.iter().find(|(_, app)| app.id == actor_sheet.app_id())
                {
                    commands
                        .entity(entity)
                        .remove::<OpenFoundryApplication>()
                        .insert(ClosedFoundryApplication);
                }
            }
            FoundryEvent::RenderItemSheet(item_sheet, _, _) => {
                if let Some((entity, _)) =
                    apps.iter().find(|(_, app)| app.id == item_sheet.app_id())
                {
                    commands
                        .entity(entity)
                        .remove::<ClosedFoundryApplication>()
                        .insert(OpenFoundryApplication)
                        .insert(FoundryItemSheet);
                } else {
                    commands
                        .spawn()
                        .insert(FoundryApplication {
                            id: item_sheet.app_id(),
                        })
                        .insert(OpenFoundryApplication);
                }
            }
            FoundryEvent::CloseItemSheet(item_sheet, _, _) => {
                if let Some((entity, _)) =
                    apps.iter().find(|(_, app)| app.id == item_sheet.app_id())
                {
                    commands
                        .entity(entity)
                        .remove::<OpenFoundryApplication>()
                        .insert(ClosedFoundryApplication);
                }
            }
            _ => {}
        }
    }
}

pub trait ImportableComponent: Component {}

pub fn import_foundry(mut commands: Commands, foundry: Res<Foundry>) {
    for actor in foundry.iter_actors() {
        commands
            .spawn()
            .insert(FoundryActor)
            .insert(FoundryEntity { id: "".to_string() });
    }
    for item in foundry.iter_items() {
        commands
            .spawn()
            .insert(FoundryItem)
            .insert(FoundryEntity { id: "".to_string() });
    }
}

pub fn update_foundry(mut commands: Commands) {}
pub fn import_component<T: ImportableComponent>(mut commands: Commands, foundry: Res<Foundry>) {
    for document in foundry.iter_entities() {}
}

fn proxy_foundry_events(mut events: EventWriter<bindings::FoundryEvent>) {
    FOUNDRY_EVENT_BUFFER.with(|foundry_events| {
        events.send_batch(foundry_events.borrow_mut().drain(0..));
    });
}
unsafe impl Send for FoundryEvent {}
unsafe impl Sync for FoundryEvent {}
