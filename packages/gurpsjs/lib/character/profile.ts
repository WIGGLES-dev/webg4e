export class Profile {
  portrait?: string;
  name = "New Character";
  title = "";
  organization = "";
  age = "";
  birthday = "";
  religion = "";
  eyeColor = "";
  hair = "";
  skinColor = "";
  handedness = "";
  height = "";
  weight = "";
  sizeModifier = 0;
  sizeModifierBonus = 0;
  gender = "";
  playerName = "";
  techLevel = "";
  constructor() {}
  saveGcs() {
    return {
      portrait: this.portrait,
      name: this.name,
      title: this.title,
      organization: this.organization,
      age: this.age,
      birthday: this.birthday,
      religion: this.religion,
      eyes: this.eyeColor,
      hair: this.hair,
      skin: this.skinColor,
      handedness: this.handedness,
      height: this.height,
      weight: this.weight,
      size_modifier: this.sizeModifier,
      gender: this.gender,
      player_name: this.playerName,
      tech_level: this.techLevel,
    };
  }
  loadGcs(data: any) {
    try {
      let {
        portrait,
        name,
        title,
        organization,
        age,
        birthday,
        religion,
        eyes,
        hair,
        skin,
        handedness,
        height,
        weight,
        size_modifier,
        gender,
        player_name,
        tech_level,
      } = data;
      if (typeof portrait === "string") this.portrait = portrait;
      if (typeof name === "string") this.name = name;
      if (typeof title === "string") this.title = title;
      if (typeof organization === "string") this.organization = organization;
      if (typeof age === "string") this.age = age;
      if (typeof birthday === "string") this.birthday = birthday;
      if (typeof religion === "string") this.religion = religion;
      if (typeof eyes === "string") this.eyeColor = eyes;
      if (typeof hair === "string") this.hair = hair;
      if (typeof skin === "string") this.skinColor = skin;
      if (typeof height === "string") this.height = height;
      if (typeof weight === "string") this.weight = weight;
      if (typeof handedness === "string") this.handedness = handedness;
      size_modifier = +size_modifier;
      if (!Number.isNaN(size_modifier)) this.sizeModifier = size_modifier;
      if (typeof gender === "string") this.gender = gender;
      if (typeof player_name === "string") this.playerName = player_name;
      if (typeof tech_level === "string") this.techLevel = tech_level;
    } catch (err) {
      console.error(err);
    }
    return this;
  }
}
