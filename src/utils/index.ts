import { GraphQLResolveInfo } from 'graphql';

export function getFields(info: GraphQLResolveInfo): string[] {
  const fieldNodes = info.fieldNodes;
  if (!fieldNodes || fieldNodes.length === 0 || !fieldNodes[0].selectionSet) {
    return [];
  }

  const selections = fieldNodes[0].selectionSet.selections;
  return selections.map((selection) => (selection as any).name.value);
}
