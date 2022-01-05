use bevy::prelude::*;

#[derive(Component, PartialEq)]
pub enum Difficulty {
    Easy,
    Average,
    Hard,
    VeryHard,
    Wildcard,
}

impl Difficulty {
    pub fn base(&self) -> u16 {
        match self {
            Difficulty::Easy => 0,
            Difficulty::Average => 1,
            Difficulty::Hard => 2,
            Difficulty::VeryHard => 3,
            Difficulty::Wildcard => 3,
        }
    }
}

#[derive(Component)]
pub struct Points(u16);
#[derive(Component)]
pub struct SkillLevel {
    level: u16,
}
#[derive(Component)]
pub struct TechniqueLevel {
    level: u16,
}

pub fn calculate_skill_level(
    mut skills: Query<
        (Entity, &mut SkillLevel, &Points, &Difficulty),
        (Changed<Points>, Changed<Difficulty>),
    >,
) {
    for (entity, mut skill, points, difficulty) in skills.iter_mut() {
        let mut points = points.0;
        let mut base = difficulty.base();
        if *difficulty == Difficulty::Wildcard {
            points = points / 3;
        }
        if points <= 4 {
        } else {
        }
        skill.level = base;
    }
}

pub fn calculate_technique_level(
    mut techniques: Query<(&mut TechniqueLevel, &Points, &Difficulty)>,
) {
    for (mut technique, points, difficulty) in techniques.iter_mut() {}
}
