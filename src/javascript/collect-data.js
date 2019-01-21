module.exports = function({ types: t }) {
  return {
    name: 'collect-data',
    visitor: {
      MemberExpression(path) {
        // avoid duplicated visit
        if (t.isMemberExpression(path.parent)) {
          return;
        }
        const referenceInfo = resolveReference(path);
        handleReference(path, referenceInfo);
      }
    }
  }

  function resolveReference(path, node) {
    const props = [];
    let cursor = node || path.node;
    let reference = null;
    let hasThis = false;
    let hasThisData = false;
    let hasThisDataProp = false;
    let { loc } = cursor;

    while(cursor) {
      if (t.isIdentifier(cursor)) {
        reference = resolveIdentifierReference(path, cursor);
        if (reference) {
          hasThis = reference.hasThis;
        }
      }
      if (t.isThisExpression(cursor)) {
        hasThis = true;
      }

      const propName = getPropertyFromMemberExpression(cursor)
      props.unshift(propName);
      cursor = cursor.object;
    }

    const name = props[props.length - 1];
    const full = props.join('.');
    if (
      (reference && reference.hasThisData) ||
      (name === 'data' && reference && reference.hasThis) ||
      (hasThis && props[1] === 'data')
    ) {
      hasThisData = true;
    }
    if (
      (reference && (reference.hasThisData || reference.hasThisDataProp)) ||
      (hasThis && hasThisData && props[2])
    ) {
      hasThisDataProp = true;
    }
    let dataPropRoot = null;
    
    if (hasThisDataProp) {
      if (reference && reference.dataPropRoot) {
        dataPropRoot = reference.dataPropRoot;
      } else if (reference && reference.hasThisData) {
        dataPropRoot = props[1];
      } else if(hasThisData && hasThisDataProp) {
        dataPropRoot = props[2];
      } else {
        dataPropRoot = reference.dataPropRoot;
      }
    }

    return {
      name,
      full,
      hasThis,
      hasThisData,
      hasThisDataProp,
      dataPropRoot,
      props,
      reference,
      loc,
    };
  }

  function resolveIdentifierReference(path, id) {
    const binding = path.scope.getBinding(id.name);
    if (binding && t.isVariableDeclarator(binding.path.node)) {
      return resolveReference(path, binding.path.node.init)
    }
    return null;
  }

  function getPropertyFromMemberExpression(node) {
    const { property } = node;
    if (t.isIdentifier(node)) {
      return node.name;
    } else if (t.isStringLiteral(property)) {
      return property.value;
    } else if (t.isThisExpression(node)){
      return 'this';
    } else {
      return property.name;
    }
  }

  function handleReference(path, ref) {
    if (ref.hasThisDataProp) {
      if (t.isAssignmentExpression(path.parent) && path.parentKey === 'left') {
        addData(path, ref, 'modified');
      } else {
        addData(path, ref, 'unmodified');
      }
    }
  }

  function addData(path, info, type = 'modified') {
    let dataCollection = path.hub.file.metadata.dataCollection;
    if (!dataCollection) {
      dataCollection = path.hub.file.metadata.dataCollection = {
        modified: {},
        unmodified: {}
      }
    }
    const { modified, unmodified } = dataCollection;
    const { dataPropRoot } = info;
    if (type === 'modified') {
      if (!modified[dataPropRoot]) {
        modified[dataPropRoot] = [];
      }
      modified[dataPropRoot].push(info);
      if (unmodified[dataPropRoot]) {
        delete unmodified[dataPropRoot];
      }
    } else if(type === 'unmodified' && !modified[dataPropRoot]) {
      if (!unmodified[dataPropRoot]) {
        unmodified[dataPropRoot] = [];
      }
      unmodified[dataPropRoot].push(info);
    }
  }
}
