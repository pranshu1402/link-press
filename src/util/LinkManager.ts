export class LinkManager {
  private static index: number;

  public static hasManagedIndex() {
    return typeof this.index === 'number';
  }

  public static getIndex() {
    return this.index;
  }

  public static setIndex(index: number) {
    this.index = index;
  }

  public static incrementIndex() {
    this.index = this.index + 1;
  }

  public static getAndIncrementIndex() {
    const currentIndex = this.getIndex();
    this.incrementIndex();
    return currentIndex;
  }
}
