function initStorage(events) {
  // Listen for userLocationAcquired events to store the location.
  events.addEventListener('userLocationAcquired', (evt) => {
    const { lat, lng } = evt.detail;
    localStorage.setItem('userPoint', JSON.stringify({ lat, lng }));
    console.log('Stored user location in localStorage:', lat, lng);
  });


  const storedPoint = localStorage.getItem('userPoint');
  if (storedPoint) {
    try {
      const { lat, lng } = JSON.parse(storedPoint);
      const event = new CustomEvent('userLocationAcquired', {
        detail: { lat, lng },
      });
      events.dispatchEvent(event);
      console.log('Dispatched stored user location from localStorage:', lat, lng);
    } catch (error) {
      console.error('Error parsing stored user location from localStorage:', error);
    }
  }
}

export { initStorage };
