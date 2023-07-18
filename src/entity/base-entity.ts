type Mutable<T> = {
  -readonly [k in keyof T]: T[k];
};

export abstract class BaseEntity {
  protected get mutable() {
    return this as Mutable<typeof this>;
  }
}
