class PetNameCounter {
  constructor(petList) {
    this.petList = petList;
  }

  countNames() {
    const counts = {};
    for (const { name } of this.petList) {
      counts[name] = (counts[name] || 0) + 1;
    }
    return counts;
  }
}

module.exports = PetNameCounter;