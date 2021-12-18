import { Component } from "..";
class Attribute {}
class AttributeDef {}

class AttributeDefSet extends Component {
  defs: AttributeDef[] = [];
}
class AttributeSet extends Component {
  attributes: Attribute[] = [];
}
