/* Sample listings: every name, figure and description here is placeholder content to replace before launch. */
window.KEYHAVEN_HOMES = (() => {
  const u = (id, w, h) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=80`;
  return [
    {
      id: 'casa-arenal',
      name: 'Casa Arenal',
      place: 'Montecito, California',
      line: 'A five-bedroom villa above the Montecito shore, built around a 60-foot pool.',
      price: 8450000,
      facts: [['5', 'bedrooms'], ['6', 'bathrooms'], ['6,200', 'square feet'], ['1.1', 'acres'], ['2019', 'built']],
      about: [
        'Casa Arenal was drawn as one long room that opens to the garden: the living and dining floor runs the length of the pool, and every pane of the ground floor slides away in summer.',
        'Upstairs, the principal suite looks over the canopy towards the Channel Islands. The cedar soffits and travertine floors carry from inside to out without a step.',
      ],
      features: ['Pocketing glass walls on the ground floor', '60-foot heated lap pool', 'Principal suite with a terrace and two dressing rooms', 'Outdoor kitchen under a cedar canopy', 'Three-car garage with EV charging', 'Solar array and whole-house battery'],
      hero: u('1613490493576-7fde63acd811', 2400),
      gallery: [
        [u('1600607688969-a5bfcd646154', 1600, 1000), 'The garden front at dusk'],
        [u('1600573472550-8090b5e0745e', 900, 1125), 'Double-height living room'],
        [u('1600585152220-90363fe7e115', 1000, 1000), 'Kitchen with a marble island'],
        [u('1616594039964-ae9021a400a0', 1600, 1000), 'Principal bedroom'],
      ],
    },
    {
      id: 'linden-house',
      name: 'Linden House',
      place: 'Austin, Texas',
      line: 'A four-bedroom house of timber and glass on a quiet street in Tarrytown.',
      price: 3280000,
      facts: [['4', 'bedrooms'], ['3', 'bathrooms'], ['3,900', 'square feet'], ['0.4', 'acres'], ['2021', 'built']],
      about: [
        'Linden House is clad in charred cedar and set back behind a row of live oaks. The rooms step down the slope, so the kitchen, dining room and den each sit a few steps apart and open to their own terrace.',
        'A studio above the garage has its own entrance, a kitchenette and a full bath.',
      ],
      features: ['Charred-cedar cladding', 'Kitchen with a walk-in pantry', 'Separate studio over the garage', 'Screened porch with a fireplace', 'Native-planted garden on drip irrigation'],
      hero: u('1600047509358-9dc75507daeb', 2400),
      gallery: [
        [u('1600047509807-ba8f99d2cdde', 1600, 1000), 'The street front'],
        [u('1600585154526-990dced4db0d', 900, 1125), 'Living room in the evening'],
        [u('1618221195710-dd6b41faaea6', 1000, 1000), 'The den'],
        [u('1631049307264-da0ec9d70304', 1600, 1000), 'Principal bedroom'],
      ],
    },
    {
      id: 'glass-pavilion',
      name: 'Glass Pavilion',
      place: 'Paradise Valley, Arizona',
      line: 'A five-bedroom desert pavilion with Camelback Mountain in every room.',
      price: 5950000,
      facts: [['5', 'bedrooms'], ['5', 'bathrooms'], ['5,400', 'square feet'], ['1.4', 'acres'], ['2018', 'built']],
      about: [
        'Glass Pavilion sits low on its lot under a deep flat roof that shades the glass from the afternoon sun. The great room faces the mountain; the bedrooms face the garden courtyards.',
        'The pool and spa run along the south terrace, with a ramada and an outdoor fireplace at the far end.',
      ],
      features: ['Floor-to-ceiling glass under a deep roof', 'Pool, spa and ramada', 'Wine room for 600 bottles', 'Guest casita', 'Courtyard gardens on every side'],
      hero: u('1602343168117-bb8ffe3e2e9f', 2400),
      gallery: [
        [u('1613977257363-707ba9348227', 1600, 1000), 'The pool terrace'],
        [u('1564078516393-cf04bd966897', 900, 1125), 'The great room at dusk'],
        [u('1617806118233-18e1de247200', 1000, 1000), 'Sitting room'],
        [u('1600566752355-35792bedcfea', 1600, 1000), 'Principal bath'],
      ],
    },
    {
      id: 'harrow-hall',
      name: 'Harrow Hall',
      place: 'Greenwich, Connecticut',
      line: 'A six-bedroom stone house on two acres of lawn and old oaks in Greenwich.',
      price: 7100000,
      facts: [['6', 'bedrooms'], ['7', 'bathrooms'], ['8,100', 'square feet'], ['2.3', 'acres'], ['2008', 'built']],
      about: [
        'Harrow Hall was built in limestone and slate to look as if it had always been there. The entrance hall opens to a library, a panelled study and a dining room for fourteen.',
        'The lower level holds a cinema, a gym and a guest suite, and the grounds run down to a pond and an orchard.',
      ],
      features: ['Limestone and slate exterior', 'Library and panelled study', 'Dining room for fourteen', 'Lower level with cinema and gym', 'Orchard, pond and lawns'],
      hero: u('1505843513577-22bb7d21e455', 2400),
      gallery: [
        [u('1600563438938-a9a27216b4f5', 1600, 1000), 'The house from the lawn'],
        [u('1615873968403-89e068629265', 900, 1125), 'The study'],
        [u('1600210491892-03d54c0aaf87', 1000, 1000), 'Morning room'],
        [u('1499916078039-922301b0eb9b', 1600, 1000), 'Guest sitting room'],
      ],
    },
  ];
})();
