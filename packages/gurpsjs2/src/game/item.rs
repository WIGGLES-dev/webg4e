use bevy::prelude::*;

#[derive(PartialEq, Eq, Clone, Debug, Hash, SystemLabel)]
pub enum ItemLabels {
    ExtendedSystem,
}

pub struct ItemPlugin;

impl Plugin for ItemPlugin {
    fn build(&self, app: &mut App) {
        app.add_system_to_stage(
            CoreStage::PreUpdate,
            extended_system.label(ItemLabels::ExtendedSystem),
        )
        .add_system_to_stage(
            CoreStage::PreUpdate,
            extended_system_deep.after(ItemLabels::ExtendedSystem),
        );
    }
}

#[derive(Component, Default)]
pub struct Quantity {
    pub amount: u32,
}
#[derive(Component, Default)]
pub struct Value {
    pub amount: u32,
}
#[derive(Component, Default)]
pub struct Weight {
    pub amount: u32,
}
#[derive(Component, Default)]
pub struct ExtendedWeight {
    pub amount: u32,
}
#[derive(Component, Default)]
pub struct ExtendedValue {
    pub amount: u32,
}

#[derive(Component, Default)]
pub struct Item;

#[derive(Bundle, Default)]
pub struct ItemBundle {
    quantity: Quantity,
    weight: Weight,
    extended_weight: ExtendedWeight,
    value: Value,
    extended_value: ExtendedValue,
    marker: Item,
}

pub fn extended_system(
    mut items: Query<(
        Option<&Quantity>,
        Option<&Weight>,
        Option<&Value>,
        Option<&mut ExtendedWeight>,
        Option<&mut ExtendedValue>,
    )>,
) {
    for (q, w, v, ew, ev) in items.iter_mut() {
        let q = q.map_or(1, |q| q.amount);
        let w = w.map_or(0, |w| w.amount);
        let v = v.map_or(0, |v| v.amount);
        if let Some(mut ew) = ew {
            ew.amount = q * w;
        }
        if let Some(mut ev) = ev {
            ev.amount = q * v;
        }
    }
}

pub fn extended_system_deep() {}
