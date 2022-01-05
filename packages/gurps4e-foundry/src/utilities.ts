export const removeAllItems = async (actor: Actor) => {
  const ids = [...actor.items.values()]
    .map((item) => item.id)
    .filter((value): value is string => typeof value === "string");
  return await actor.deleteEmbeddedDocuments("Item", ids);
};
