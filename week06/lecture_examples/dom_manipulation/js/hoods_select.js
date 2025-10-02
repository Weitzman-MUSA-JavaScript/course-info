function initHoodsSelect(el, hoods, events) {
  const listEl = el.querySelector('ul');
  const searchEl = el.querySelector('.search');

  // Initialize the list items
  const hoodListItems = {};
  function initListItems() {
    for (const hood of hoods) {
      const hoodName = hood.properties['NAME'];
      const item = document.createElement('li');
      item.innerHTML = `
        <label>
          <input name="neighborhood" type="checkbox" value="${ hood.properties['NAME'] }">
          ${ hood.properties['LISTNAME']}
        </label>
      `;
      hoodListItems[hoodName] = item;
    }
  }
  initListItems();
  console.log(hoodListItems)

  // Populate the list of data
  function populateList(hoods) {
    listEl.innerHTML = '';

    hoods = hoods.sort((a, b) => {
      return a.properties['LISTNAME'].localeCompare(
        b.properties['LISTNAME']
      );
    })

    for (const hood of hoods) {
      const hoodName = hood.properties['NAME'];
      const item = hoodListItems[hoodName];
      listEl.append(item);
    }
  }
  populateList(hoods);

  // Capture the search input
  function handleSearchInput(evt) {
    const filteredHoods = hoods.filter((hood) => {
      const searchValue = searchEl.value.toLowerCase();
      const hoodName = hood.properties['LISTNAME'].toLowerCase();
      return hoodName.includes(searchValue);
    });

    populateList(filteredHoods);
  }
  searchEl.addEventListener('input', handleSearchInput);

  // Capture the checkbox input
  function handleCheckboxChange(evt) {
    const checkbox = evt.target;
    const name = checkbox.value;
    const selected = checkbox.checked;

    const event = new CustomEvent('neighborhoodselected', {
      detail: { name, selected }
    });
    events.dispatchEvent(event);
  }
  for (const item of Object.values(hoodListItems)) {
    const checkbox = item.querySelector('input');
    checkbox.addEventListener('change', handleCheckboxChange);
  }
}

export { initHoodsSelect };
