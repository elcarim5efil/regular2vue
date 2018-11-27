const { transformJs } = require('../../src/javascript')

describe('collect left data', () => {
  it('basic left 0', () => {
    const code = `
    export default {
      config() {
        this.data.a = 100;
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified.a).toBeDefined();
    expect(res.unmodified).toEqual({});
  })

  it('basic left 1', () => {
    const code = `
    export default {
      config() {
        const self = this;
        self.data.a = 100
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified.a).toBeDefined();
    expect(res.unmodified).toEqual({});
  })

  it('basic left 2', () => {
    const code = `
    export default {
      config() {
        const data = this.data;
        data.a = 100
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified.a).toBeDefined();
    expect(res.unmodified).toEqual({});
  })

  it('basic left 3', () => {
    const code = `
    export default {
      config() {
        const self = this;
        const data = self.data;
        data.a = 100
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified.a).toBeDefined();
    expect(res.unmodified).toEqual({});
  })

  it('basic left 4', () => {
    const code = `
    export default {
      config() {
        const a = this.data.a;
        a.b = 100
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified.a).toBeDefined();
    expect(res.unmodified).toEqual({});
  })

  it('basic left 5', () => {
    const code = `
    export default {
      config() {
        const self = this;
        const a = self.data.a;
        a.b = 100
      }
    }
    `
  })

  it('basic left 6', () => {
    const code = `
    export default {
      config() {
        const self = this;
        const data = self.data;
        const a = data.a;
        a.b = 100
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified.a).toBeDefined();
    expect(res.unmodified).toEqual({});
  })

  it('basic left 6, destructuring', () => {
    const code = `
    export default {
      config() {
        const { data } = this.data;
        data.a = 100
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified.a).toBeDefined();
    expect(res.unmodified).toEqual({});
  })
})

describe('collect right data', () => {
  it('basic right 0', () => {
    const code = `
    export default {
      config() {
        const a = this.data.a
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified).toEqual({});
    expect(res.unmodified.a).toBeDefined();
  })

  it('basic right 1', () => {
    const code = `
    export default {
      config() {
        const self = this;
        const a = self.data.a
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified).toEqual({});
    expect(res.unmodified.a).toBeDefined();
  })

  it('basic right 2', () => {
    const code = `
    export default {
      config() {
        const data = this.data;
        const a = data.a;
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified).toEqual({});
    expect(res.unmodified.a).toBeDefined();
  })

  it.skip('basic right 3', () => {
    const code = `
    export default {
      config() {
        const { a } = this.data;
        const b = a;
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified).toEqual({});
    expect(res.unmodified.a).toBeDefined();
  })
})

describe('collect mixed data', () => {
  it('basic mixed 0', () => {
    const code = `
    export default {
      config() {
        const data = this.data;
        this.data.b = data.a
      }
    }
    `
    const res = transformJs(code);
    expect(res.modified.b).toBeDefined();
    expect(res.unmodified.a).toBeDefined();
  })
})