import { World, Component, Resource, Child, Parent } from "./index";

class TestComponent extends Component {}

class TestResource extends Resource {}

const TestWorld = new World();
TestWorld.addResource(new TestResource());

TestWorld.spawn([new TestComponent()]);
