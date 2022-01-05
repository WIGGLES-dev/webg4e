use bevy::prelude::*;
use std::{cell::RefCell, rc::Rc};
use wasm_bindgen::{prelude::*, JsCast};

pub mod foundry;
pub mod game;
pub mod plugins;
pub mod ui;
pub mod util;

#[wasm_bindgen]
#[derive(Clone)]
pub struct WorldInterface {
    app: Rc<RefCell<App>>,
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

#[wasm_bindgen]
impl WorldInterface {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let mut app = App::new();
        app.add_plugin(JsInterfacePlugin);
        let shared_app = Rc::new(RefCell::new(app));
        Self { app: shared_app }
    }
    pub fn update(&mut self) {
        if let Some(mut app) = self.app.try_borrow_mut().ok() {
            app.update();
        }
    }
    pub fn run(&mut self) {
        if let Some(mut app) = self.app.try_borrow_mut().ok() {
            app.run();
        }
    }
    pub fn run_foundry() {
        let element = web_sys::window()
            .unwrap()
            .document()
            .unwrap()
            .create_element("template")
            .unwrap();
        std::mem::drop(yew::start_app_in_element::<ui::Ui>(element));
    }
}
