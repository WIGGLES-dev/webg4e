use bevy::ecs::query::{FilterFetch, WorldQuery};
use bevy::prelude::*;

pub struct TreePlugin;

impl Plugin for TreePlugin {
    fn build(&self, app: &mut App) {
        app.add_system_to_stage(CoreStage::PreUpdate, depth_system);
    }
}

#[derive(Component)]
pub struct Root(pub Entity);

#[derive(Component)]
pub struct Depth(pub usize);

fn depth_system(
    mut depths: Query<(Entity, &mut Depth), With<Parent>>,
    hierarchy: Query<Entity, With<Children>>,
) {
    for (entity, mut depth) in depths.iter_mut() {
        let (_, upper) = AncestorIter::new(&hierarchy, &entity).size_hint();
        let upper = upper.unwrap();
        depth.0 = upper;
    }
}

pub struct DescendantIter<'world, 'state, Q: WorldQuery, F: WorldQuery>
where
    F::Fetch: FilterFetch,
{
    max: Option<u32>,
    depth: u32,
    stack: Vec<&'world Entity>,
    query: &'world Query<'world, 'state, Q, F>,
}

impl<'world, 'state, Q: WorldQuery, F: WorldQuery> DescendantIter<'world, 'state, Q, F>
where
    F::Fetch: FilterFetch,
{
    pub fn new(query: &'world Query<'world, 'state, Q, F>, entity: &'world Entity) -> Self {
        let stack = vec![entity];
        Self {
            max: None,
            depth: 0,
            stack,
            query,
        }
    }
    pub fn max(mut self, depth: u32) -> Self {
        self.max = Some(depth);
        self
    }
}

impl<'world, 'state, Q: WorldQuery, F: WorldQuery> Iterator for DescendantIter<'world, 'state, Q, F>
where
    F::Fetch: FilterFetch,
{
    type Item = &'world Entity;

    fn next(&mut self) -> Option<Self::Item> {
        if let Some(max) = self.max {
            if max == self.depth {
                return None;
            }
        }
        let next = self.stack.pop();
        if let Some(next) = next {
            if let Ok(children) = self.query.get_component::<Children>(*next) {
                self.depth += 1;
                self.stack.extend(children.iter());
            }
        }
        next
    }
}

pub struct AncestorIter<'world, 'state, Q: WorldQuery, F: WorldQuery>
where
    F::Fetch: FilterFetch,
{
    max: Option<u32>,
    height: u32,
    query: &'world Query<'world, 'state, Q, F>,
    cursor: Option<&'world Entity>,
}

impl<'world, 'state, Q: WorldQuery, F: WorldQuery> AncestorIter<'world, 'state, Q, F>
where
    F::Fetch: FilterFetch,
{
    pub fn new(query: &'world Query<'world, 'state, Q, F>, entity: &'world Entity) -> Self {
        Self {
            max: None,
            height: 0,
            query,
            cursor: Some(entity),
        }
    }
    pub fn max(mut self, depth: u32) -> Self {
        self.max = Some(depth);
        self
    }
}

impl<'world, 'state, Q: WorldQuery, F: WorldQuery> Iterator for AncestorIter<'world, 'state, Q, F>
where
    F::Fetch: FilterFetch,
{
    type Item = &'world Entity;

    fn next(&mut self) -> Option<Self::Item> {
        if let Some(max) = self.max {
            if max == self.height {
                return None;
            }
        }
        if let Some(next) = self.cursor {
            if let Ok(Parent(entity)) = self.query.get_component::<Parent>(*next) {
                self.cursor = Some(entity);
                self.height += 1;
                return self.cursor;
            }
        }
        None
    }
}
