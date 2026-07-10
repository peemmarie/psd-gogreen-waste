/**
 * eslint-plugin-tlm
 *
 * Custom ESLint plugin for Smart Transformer CRM project conventions.
 *
 * Rules:
 *   - component-function-order: Enforce handler → helper → effect → return
 *     ordering for function declarations inside React component bodies.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const HANDLER_PREFIXES = ['handle', 'on', 'toggle', 'reset', 'clear']

/**
 * Returns true when the function name starts with a known handler prefix.
 * @param {string} name
 * @returns {boolean}
 */
function isHandlerName(name) {
  return HANDLER_PREFIXES.some((prefix) => {
    if (name === prefix) return true
    // e.g. handleSave, onSubmit, toggleLine, resetFilters, clearFilters
    const charAfterPrefix = name[prefix.length]
    return (
      name.startsWith(prefix) &&
      charAfterPrefix !== undefined &&
      charAfterPrefix === charAfterPrefix.toUpperCase()
    )
  })
}

/**
 * Returns true when a node is a React component function:
 *   - PascalCase name
 *   - Direct child of Program (module-level) or ExportNamedDeclaration
 *   - Declared with `function` keyword (FunctionDeclaration)
 */
function isComponentFunction(node) {
  const name = node.id && node.id.name
  if (!name) return false

  // Must start with uppercase letter (PascalCase)
  if (name[0] !== name[0].toUpperCase() || name[0] === name[0].toLowerCase()) {
    return false
  }

  const parent = node.parent
  return (
    parent.type === 'Program' ||
    (parent.type === 'ExportNamedDeclaration' &&
      parent.parent.type === 'Program')
  )
}

/**
 * Check whether a statement is a useEffect call expression (statement).
 * Matches: `useEffect(() => { ... }, [deps])`
 */
function isUseEffectCall(node) {
  if (node.type !== 'ExpressionStatement') return false
  const expr = node.expression
  if (expr.type !== 'CallExpression') return false
  const callee = expr.callee
  return callee.type === 'Identifier' && callee.name === 'useEffect'
}

// ---------------------------------------------------------------------------
// Rule: component-function-order
// ---------------------------------------------------------------------------

const CATEGORY_HANDLER = 1
const CATEGORY_HELPER = 2

const componentFunctionOrderRule = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce that handler function declarations appear before helper function declarations inside React components, and that no function declarations appear after useEffect calls or the return statement.',
      recommended: true,
    },
    schema: [],
    messages: {
      helperBeforeHandler:
        "Helper function '{{helper}}' should be declared after handler function '{{handler}}'. " +
        'Handlers (handle*, on*, toggle*, reset*, clear*) must come before helpers.',
      functionAfterEffect:
        "Function '{{name}}' is declared after a useEffect call. " +
        'Move all function declarations before useEffect.',
      functionAfterReturn:
        "Function '{{name}}' is declared after the return statement. " +
        'Move all function declarations before the return.',
    },
  },

  create(context) {
    return {
      /**
       * Visit every function declaration that is a React component and
       * inspect its body for ordering violations.
       */
      FunctionDeclaration(node) {
        if (!isComponentFunction(node)) return

        const body = node.body && node.body.body
        if (!body || body.length === 0) return

        // Collect inner function declarations and their categories
        /** @type {{ node: import('estree').FunctionDeclaration, name: string, category: number, index: number }[]} */
        const functions = []

        let hasSeenEffect = false
        let hasSeenReturn = false

        for (let i = 0; i < body.length; i++) {
          const stmt = body[i]

          // Track useEffect
          if (isUseEffectCall(stmt)) {
            hasSeenEffect = true
            continue
          }

          // Track return statement
          if (stmt.type === 'ReturnStatement') {
            hasSeenReturn = true
            continue
          }

          // Inner function declaration
          if (stmt.type === 'FunctionDeclaration' && stmt.id) {
            const name = stmt.id.name
            const category = isHandlerName(name)
              ? CATEGORY_HANDLER
              : CATEGORY_HELPER

            // Check: function after useEffect
            if (hasSeenEffect) {
              context.report({
                data: { name },
                messageId: 'functionAfterEffect',
                node: stmt,
              })
              continue
            }

            // Check: function after return
            if (hasSeenReturn) {
              context.report({
                data: { name },
                messageId: 'functionAfterReturn',
                node: stmt,
              })
              continue
            }

            functions.push({ category, index: i, name, node: stmt })
          }
        }

        // Check ordering: all handlers must appear before all helpers
        let lastHandler = null
        for (const fn of functions) {
          if (fn.category === CATEGORY_HANDLER) {
            lastHandler = fn
          }
        }

        if (lastHandler) {
          for (const fn of functions) {
            if (
              fn.category === CATEGORY_HELPER &&
              fn.index < lastHandler.index
            ) {
              context.report({
                data: { handler: lastHandler.name, helper: fn.name },
                messageId: 'helperBeforeHandler',
                node: fn.node,
              })
            }
          }
        }
      },
    }
  },
}

// ---------------------------------------------------------------------------
// Plugin export
// ---------------------------------------------------------------------------

const plugin = {
  meta: {
    name: 'eslint-plugin-tlm',
    version: '1.0.0',
  },
  rules: {
    'component-function-order': componentFunctionOrderRule,
  },
}

export default plugin
