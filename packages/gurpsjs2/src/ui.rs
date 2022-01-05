pub mod sheet;
use crate::foundry::{FoundryApplication, FoundryEvent, FoundryPlugin, OpenFoundryApplication};
use bevy::prelude::*;
use bevy_ecs::query::{FilterFetch, WorldQuery};
use std::{cell::RefCell, marker::PhantomData, rc::Rc};
use wasm_bindgen::{prelude::*, JsCast};
use yew::prelude::*;

pub fn system_view(f: impl Fn() -> Html) {}

pub struct AppState {
    app: Rc<RefCell<App>>,
}

impl AppState {
    pub fn new(app: App) -> Self {
        Self {
            app: Rc::new(RefCell::new(app)),
        }
    }
}

#[function_component]
pub fn Ui() -> Html {
    let app = use_mut_ref(|| AppState::new(App::new()));
    html! {}
}
