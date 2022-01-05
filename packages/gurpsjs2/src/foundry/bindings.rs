use std::{cell::RefCell, collections::HashMap};
use wasm_bindgen::{closure::Closure, prelude::*, JsCast};
use serde::{Serialize, Deserialize};

#[wasm_bindgen]
extern "C" {
    type Hooks;
    #[wasm_bindgen(variadic, static_method_of=Hooks)]
    fn call(hook: &str, args: Vec<JsValue>) -> bool;
    #[wasm_bindgen(js_name="callAll", variadic, static_method_of=Hooks)]
    fn call_all(hook: &str, args: Vec<JsValue>) -> bool;
    #[wasm_bindgen(static_method_of=Hooks)]
    fn off(hook: &str, f: i32);
    #[wasm_bindgen(static_method_of=Hooks)]
    fn on(hook: &str, f: &FoundryHook) -> i32;
    #[wasm_bindgen(static_method_of=Hooks)]
    fn once(hook: &str, f: &FoundryHook) -> i32;
}

pub type FoundryHook = Closure<dyn Fn(JsValue, JsValue, JsValue)>;

thread_local! {
    static HOOKS: RefCell<HashMap<i32, FoundryHook>> = RefCell::new(HashMap::new());
}

pub struct Hook(String, i32);

pub enum FoundryEvent {
    Init,
    Ready,

    CreateActor(Actor, DocumentModificationContext, String),
    UpdateActor(Actor, JsValue, DocumentModificationContext),
    DeleteActor(Actor, DocumentModificationContext, String),

    CreateItem(Item, DocumentModificationContext, String),
    UpdateItem(Item, JsValue, DocumentModificationContext),
    DeleteItem(Item, DocumentModificationContext, String),

    RenderActorSheet(Application, JsValue, JsValue),
    CloseActorSheet(Application, JsValue, JsValue),

    RenderItemSheet(Application, JsValue, JsValue),
    CloseItemSheet(Application, JsValue, JsValue),

    Unknown
}

impl FoundryEvent {
    pub const HOOKS: &'static [&'static str] = &[ 
        "init",
        "ready",
        "createActor",
        "updateActor", 
        "deleteActor", 
        "createItem", 
        "updateItem",
        "deleteItem",
        "renderActorSheet",
        "closeActorSheet", 
        "renderItemSheet",
        "closeItemSheet"
    ];
    pub fn hook_name(&self) -> &str {
        match self {
            Self::Init => &"init",
            Self::Ready => &"ready",
            Self::CreateActor(_,_,_) => &"createActor",
            Self::UpdateActor(_,_,_) => &"updateActor",
            Self::DeleteActor(_,_,_) => &"deleteActor",
            Self::CreateItem(_,_,_) => &"createItem",
            Self::UpdateItem(_,_,_) => &"updateItem",
            Self::DeleteItem(_,_,_) => &"deleteItem",
            Self::RenderActorSheet(_,_,_) => &"renderActorSheet",
            Self::CloseActorSheet(_,_,_) => &"closeActorSheet",
            Self::RenderItemSheet(_,_,_) => &"renderItemSheet",
            Self::CloseItemSheet(_,_,_) => &"closeItemSheet",
            Self::Unknown => &"unknown"
        }
    }
    pub fn create(hook: &str, arg1: JsValue, arg2: JsValue, arg3: JsValue) -> Self {
        web_sys::console::log_3(&arg1, &arg2, &arg3);
        match hook {
            "init" => Self::Init,
            "ready" => Self::Ready,
            "createActor" => Self::CreateActor(arg1.into(), arg2.into_serde().unwrap(), arg3.as_string().unwrap()),
            "updateActor" => Self::UpdateActor(arg1.into(), arg2, arg3.into_serde().unwrap()),
            "deleteActor" => Self::DeleteActor(arg1.into(), arg2.into_serde().unwrap(), arg3.as_string().unwrap()),
            "createItem" => Self::CreateActor(arg1.into(), arg2.into_serde().unwrap(), arg3.as_string().unwrap()),
            "updateItem" => Self::UpdateActor(arg1.into(), arg2, arg3.into_serde().unwrap()),
            "deleteItem" => Self::DeleteActor(arg1.into(), arg2.into_serde().unwrap(), arg3.as_string().unwrap()),
            "renderActorSheet" => Self::RenderActorSheet(arg1.into(), arg2, arg3),
            "closeActorSheet" => Self::CloseActorSheet(arg1.into(), arg2, arg3),
            "renderItemSheet" => Self::RenderItemSheet(arg1.into(), arg2, arg3),
            "closeItemSheet" => Self::CloseItemSheet(arg1.into(), arg2, arg3),
            _ => Self::Unknown
        }
    } 
}

impl Hook {
    pub fn new(hook: String, f: FoundryHook) -> Self {
        let id = HOOKS.with(|hooks| {
            let mut hooks = hooks.borrow_mut();
            let id = Hooks::on(&hook, &f);
            hooks.insert(id, f);
            id
        });
        Self(hook, id)
    }
    pub fn simple(hook: String, f: impl 'static + Fn(JsValue, JsValue, JsValue)) -> Self {
        let closure: FoundryHook = Closure::new(f);
        Self::new(hook, closure)
    }
}

impl Drop for Hook {
    fn drop(&mut self) {
        HOOKS.with(|hooks| {
            let mut hooks = hooks.borrow_mut();
            Hooks::off(&self.0, self.1);
            hooks.remove_entry(&self.1);
        })
    }
}

#[wasm_bindgen]
extern "C" {
    pub type Game;
    #[wasm_bindgen(method, getter)]
    pub fn actors(this: &Game) -> Actors;
    #[wasm_bindgen(method, getter)]
    pub fn items(this: &Game) -> Items;
}

pub fn game() -> Game {
    let window = web_sys::window().unwrap();
    js_sys::Reflect::get(&window, &"game".into())
        .unwrap()
        .unchecked_into()
}

#[wasm_bindgen]
extern "C" {
    pub type Application;
    #[wasm_bindgen(method, getter, js_name="appId")]
    pub fn app_id(this: &Application) -> u32;
    #[wasm_bindgen(method)]
    pub fn render(this: &Application) -> Application;
    #[wasm_bindgen(method, getter)]
    pub fn rendered(this: &Application) -> bool;
    #[wasm_bindgen(method, getter)]
    pub fn elmenet(this: &Application) -> web_sys::HtmlElement;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(extends=js_sys::Map)]
    pub type Collection;
    #[wasm_bindgen(extends=Collection)]
    pub type DocumentCollection;
    #[wasm_bindgen(extends=DocumentCollection, extends=Collection, extends=js_sys::Map)]
    pub type WorldCollection;
}

#[wasm_bindgen]
#[derive(Serialize,Deserialize)]
pub struct DocumentModificationContext {
    #[serde(skip)]
    #[wasm_bindgen(skip)]
    pub parent: Option<Document>,
    #[wasm_bindgen(js_name="noHook")]
    pub no_hook: Option<bool>,
    pub index: Option<bool>,
    #[wasm_bindgen(skip)]
    pub index_fields: Option<Vec<String>>,
    #[wasm_bindgen(js_name="keepId")]
    pub keep_id: Option<bool>,
    #[wasm_bindgen(js_name="keepEmbeddedIds")]
    pub keep_embedded_ids: Option<bool>,
    pub temporary: Option<bool>,
    pub render: Option<bool>,
    #[wasm_bindgen(js_name="renderSheet")]
    pub render_sheet: Option<bool>,
    pub diff: Option<bool>,
    pub recursive: Option<bool>,
    #[wasm_bindgen(js_name="isUndo")]
    pub is_undo: Option<bool>,
    #[wasm_bindgen(js_name="deleteAll")]
    pub delete_all: Option<bool>
}


impl Default for DocumentModificationContext {
    fn default() -> Self {
        Self {
            parent: None,
            no_hook: None,
            index: None,
            index_fields: None,
            keep_id: None,
            keep_embedded_ids: None,
            temporary: None,
            render: None,
            render_sheet: None,
            diff: None,
            recursive: None,
            is_undo: None,
            delete_all: None
        }
    }
}

#[wasm_bindgen]
extern "C" {
    pub type Document;
    #[wasm_bindgen(method, getter)]
    pub fn id(this: &Document) -> Option<String>;
    #[wasm_bindgen(structural, method)]
    pub async fn update(this: &Document, data: Option<js_sys::Object>, ctx: Option<DocumentModificationContext>);
    #[wasm_bindgen(structural, method)]
    pub async fn delete(this: &Document, ctx: Option<DocumentModificationContext>);
    #[wasm_bindgen(method, js_name=getFlag)]
    pub fn flag(this: &Document, scope: String, key: String) -> JsValue;
    #[wasm_bindgen(method, js_name=setFlag)]
    pub async fn set_flag(this: &Document, scope: String, key: String, value: JsValue);
    pub type ClientDocumentMixin;
    #[wasm_bindgen(method, getter)]
    pub fn sheet(this: &Document) -> Option<Application>;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(extends=WorldCollection, extends=DocumentCollection, extends=Collection, extends=js_sys::Map)]
    pub type Actors;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(extends=Document)]
    pub type BaseActor;
    #[wasm_bindgen(extends=ClientDocumentMixin, extends=BaseActor, extends=Document)]
    pub type Actor;
    #[wasm_bindgen(static_method_of=Actor)]
    pub async fn create(data: Option<js_sys::Object>, context: Option<DocumentModificationContext>);
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(extends=WorldCollection, extends=DocumentCollection, extends=Collection, extends=js_sys::Map)]
    pub type Items;
}

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(extends=Document)]
    pub type BaseItem;
    #[wasm_bindgen(
        extends=ClientDocumentMixin, 
        extends=BaseItem,
        extends=Document
    )]
    pub type Item;
    #[wasm_bindgen(static_method_of=Item)]
    pub async fn create(data: Option<js_sys::Object>, context: Option<DocumentModificationContext>);
}