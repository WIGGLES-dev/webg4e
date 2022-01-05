use bevy::prelude::*;

#[derive(PartialEq)]
pub enum FeatureKind {
    LevelBonus,
}

pub struct Feature {
    origin: Entity,
    kind: FeatureKind,
    amount: u16,
}

#[derive(Component)]
pub struct FeatureHost;

#[derive(Component)]
pub struct FeatureCollection {
    features: Vec<Feature>,
}

impl FeatureCollection {
    pub fn add(&mut self, feature: Feature) {
        self.features.push(feature);
    }
    pub fn remove(&mut self, index: usize) {
        self.features.remove(index);
    }
    pub fn bonus(&self, kind: FeatureKind) -> i32 {
        self.features.iter().fold(0, |acc, feature| {
            if feature.kind == kind {
                acc + feature.amount as i32
            } else {
                acc
            }
        })
    }
}

pub fn feature_aggregator(
    mut commands: Commands,
    mut hosts: Query<(&mut FeatureHost, &Children)>,
    features: Query<&FeatureCollection, With<Parent>>,
) {
    for (host, children) in hosts.iter_mut() {
        for child in children.iter() {
            if let Ok(collection) = features.get(*child) {}
        }
    }
}
