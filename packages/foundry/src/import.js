import { upload } from "./util.js"
import { recursiveFlat } from "./util.js"
async function importGcsData() {
  const files = await upload()
  for (let i = 0; i < file.length; ++i) {
    const file = files[i]
    const obj = JSON.parse(file.text())
    load(obj)
  }
}

const transforms = {
  feature: {
    map(feature) {},
    unmap(feature) {},
  },
  modifier: {
    map(feature) {},
    unmap(feature) {},
  },
  weapon: {
    map(weapon) {},
    unmap(weapon) {},
  },
  attribute: {
    map(attribute) {},
    unmap(attribute) {},
  },
}

function loadCharacter(document) {
  const {
    id,
    type,
    create_date,
    modified_date,
    profile = {},
    skills = [],
    advantages = [],
    equipment = [],
    other_equipment = [],
    notes = [],
  } = document
  const items = [...skills, ...advantages, ...equipment, ...other_equipment]
    .reduce(recursiveFlat(), [])
    .map(load)
  const desc = `<p>${notes.join("</p></p>")}</p>`
  return {
    _id: document.id,
    type: "character",
    name: document.profile.name,
    img: document.profile.portrait,
    data: {
      points: document.total_points,
    },
    flags: {
      [game.system.id]: {
        created: create_date,
        modified: modified_date,
        desc,
      },
    },
    items,
  }
}

function loadAdvantage(document, parent) {
  const { id, type } = document
  return {
    id,
    type: "trait",
    data: {},
    flags: {
      [game.system.id]: {
        parent: null,
        children: [],
      },
    },
  }
}

function loadSkill(document, parent) {
  return {
    type: "skill",
  }
}
function loadTechnique(document, parent) {
  return {
    type: "skill",
    data: {
      isTechnique: true,
    },
  }
}
function loadEquipment(document, parent) {
  return {
    type: "equipment",
  }
}
function loadOtherEquipment(document, parent) {
  return {
    type: "equipment",
  }
}

function loadAdvantageList(document) {
  return document.rows.map(load)
}
function loadEquipmentList(document) {
  return document.rows.map(load)
}
function loadSkillList(document) {
  return document.rows.map(load)
}

const loadMap = {
  character: loadCharacter,
  advantage: loadAdvantage,
  skill: loadSkill,
  technique: loadTechnique,
  equipment: loadEquipment,
  other_equipment: loadOtherEquipment,
  advantage_list: loadAdvantageList,
  equipment_list: loadEquipmentList,
  skill_list: loadSkillList,
}

function load(document, parent) {
  return loadMap[document.type](document, parent)
}

function saveCharacter(document) {
  const { _id, type, flags, data, items } = document
  const { created, modified } = flags[game.system.id] || {}
  return {
    id: _id,
    type: findKey(typeMap, type),
    created_date: created,
    modified_date: modified,
    total_points: data.points,
  }
}
function saveSkill(document, parent) {
  const { _id, type, flags, data } = document
  return {
    id: _id,
    type: "skill",
  }
}
function saveTrait(document, parent) {
  const { _id, type, flags, data } = document
  return {
    id: _id,
    type: "advantage",
  }
}
function saveEquipment(document, parent) {
  const { _id, type, flags, data } = document
  return {
    id: _id,
    type: "equipment",
  }
}

const saveMap = {
  character: saveCharacter,
  skill: saveSkill,
  trait: saveTrait,
  equipment: saveEquipment,
}

function save(document, parent) {
  return saveMap[document.type](document, parent)
}
