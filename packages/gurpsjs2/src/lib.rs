#![feature(drain_filter)]
#![allow(unused_variables, unused_mut, dead_code)]

use bevy::prelude::*;
use std::{cell::RefCell, rc::Rc};
use wasm_bindgen::{prelude::*, JsCast};

pub mod foundry;
pub mod game;
pub mod plugins;
pub mod util;

#[wasm_bindgen]
pub struct WorldInterface {
    app: App,
}

pub struct JsInterfacePlugin;
impl Plugin for JsInterfacePlugin {
    fn build(&self, app: &mut App) {
        app.set_runner(js_interface_runner);
    }
}

fn js_interface_runner(mut app: App) {
    let f: Rc<RefCell<Option<Closure<dyn FnMut()>>>> = Rc::new(RefCell::new(None));
    let g = f.clone();
    *g.borrow_mut() = Some(Closure::new(move || {
        app.update();
        web_sys::window()
            .unwrap()
            .request_animation_frame(f.borrow().as_ref().unwrap().as_ref().unchecked_ref())
            .ok();
    }));
    web_sys::window()
        .unwrap()
        .request_animation_frame(g.borrow().as_ref().unwrap().as_ref().unchecked_ref())
        .ok();
}

#[derive(Component)]
pub struct Test;

#[wasm_bindgen]
impl WorldInterface {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut app = App::new();
        app.add_plugin(JsInterfacePlugin);
        Self { app }
    }
    pub fn run(&mut self) {
        self.app.run();
    }
}
