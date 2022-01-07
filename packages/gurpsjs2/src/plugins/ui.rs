use bevy::prelude::*;
use bevy_ecs::system::SystemParam;
pub struct BevyDomPlugin;

impl Plugin for BevyDomPlugin {
    fn build(&self, app: &mut App) {}
}

#[derive(SystemParam)]
pub struct Dom<'w, 's> {
    commands: Commands<'w, 's>,
}

impl<'w, 's> Dom<'w, 's> {
    pub fn render<T>(&mut self, template: &'s String, params: T) {}
}
