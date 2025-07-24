const timetableData = [
  { day: 'Monday', slots: { Morning: ['2', '4', '5', '9'], Afternoon: [], Evening: ['Dolu', 'Anik', 'Shom', '3', '5', '7'] } },
  { day: 'Tuesday', slots: { Morning: ['6', '7', '8', '9'], Afternoon: [], Evening: ['Dolu', 'Anik', 'Shom', '3', '5', '2'] } },
  { day: 'Wednesday', slots: { Morning: ['9', '8', '7', '5'], Afternoon: [], Evening: ['9', '2', '8', '6', '7', '5', '3', 'Dolu'] } },
  { day: 'Thursday', slots: { Morning: ['Dolu', 'Anik', 'Shom'], Afternoon: [], Evening: ['5', '7', '9', '2'] } },
  { day: 'Friday', slots: { Morning: ['Dolu', 'Anik', 'Shom'], Afternoon: [], Evening: ['9', '3', '2'] } },
  { day: 'Saturday', slots: { Morning: ['Dolu', 'Anik', 'Shom'], Afternoon: ['9', '8', '3', '2'], Evening: ['4', '6', '8'] } },
  { day: 'Sunday', slots: { Morning: [], Afternoon: ['9', '8', '5', '6'], Evening: ['7', '4', '3', 'Dolu', 'Anik', 'Shom'] } }
];

const formatNumberWithOrdinal = (n) => {
  const i = parseInt(n);
  if (isNaN(i)) return n;
  const j = i % 10, k = i % 100;
  if (j === 1 && k !== 11) return i + "st";
  if (j === 2 && k !== 12) return i + "nd";
  if (j === 3 && k !== 13) return i + "rd";
  return i + "th";
};

const createTag = (item) => {
  const isName = isNaN(parseInt(item));
  const bgColor = isName ? 'bg-indigo-100 text-indigo-800' : 'bg-teal-100 text-teal-800';
  const displayItem = isName ? item : formatNumberWithOrdinal(item);

  return `
    <a href="#" onclick="showDetails('${item}'); return false;" 
      class="${bgColor} clickable-tag text-xs sm:text-sm font-medium px-3 py-1 rounded-full flex items-center justify-center shadow-sm">
      ${displayItem}
    </a>
  `;
};

const sortSlotItems = (items) => {
  const numbers = items.filter(item => !isNaN(parseInt(item))).map(Number).sort((a, b) => a - b).map(String);
  const names = items.filter(item => isNaN(parseInt(item)));
  return [...numbers, ...names];
};

const renderTimetable = () => {
  const grid = document.getElementById('timetable-grid');
  let timetableHTML = '';

  timetableData.forEach((dayData, index) => {
    const isLastRow = index === timetableData.length - 1;
    const borderClass = isLastRow ? '' : 'border-b border-sky-200';
    const rowBgClass = index % 2 === 0 ? 'bg-white' : 'bg-sky-50';

    let dayHTML = `
      <div class="grid grid-cols-1 md:contents">
        <div class="p-3 font-bold text-sky-800 bg-sky-100 md:${rowBgClass} md:font-semibold md:text-slate-700 ${borderClass} md:border-r flex items-center text-lg md:text-base">
          ${dayData.day}
        </div>
        ${Object.entries(dayData.slots).map(([time, items]) => {
          const sortedItems = sortSlotItems(items);
          return `
            <div class="p-4 ${borderClass} md:border-r min-h-[60px] flex items-center ${rowBgClass}">
              <div>
                <div class="md:hidden font-semibold text-slate-500 mb-2">${time}</div>
                ${sortedItems.length > 0
                  ? `<div class="flex flex-wrap gap-2">${sortedItems.map(item => createTag(item)).join('')}</div>`
                  : '<span class="text-gray-400 text-sm">-</span>'
                }
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    timetableHTML += dayHTML;
  });

  grid.innerHTML += timetableHTML;
};

const showDetails = (item) => {
  const modal = document.getElementById('details-modal');
  const modalTitle = document.getElementById('modal-title');
  const modalBody = document.getElementById('modal-body');

  const isName = isNaN(parseInt(item));
  const displayItem = isName ? item : `${formatNumberWithOrdinal(item)} Class`;
  modalTitle.textContent = `Schedule for ${displayItem}`;

  let scheduleSummary = [];
  timetableData.forEach(dayData => {
    Object.entries(dayData.slots).forEach(([time, items]) => {
      if (items.includes(item)) {
        scheduleSummary.push({ day: dayData.day, time: time });
      }
    });
  });

  if (scheduleSummary.length > 0) {
    modalBody.innerHTML = `<p class="text-slate-600 mb-4">Here are all the scheduled times for ${displayItem}:</p>
      <ul class="space-y-2">
        ${scheduleSummary.map(s => `
          <li class="flex items-center bg-slate-50 p-3 rounded-lg">
            <span class="font-semibold text-slate-800 w-24">${s.day}</span>
            <span class="text-slate-600">${s.time}</span>
          </li>
        `).join('')}
      </ul>`;
  } else {
    modalBody.innerHTML = `<p>No schedule found for ${displayItem}.</p>`;
  }

  modal.classList.remove('hidden');
};

const hideDetails = () => {
  const modal = document.getElementById('details-modal');
  modal.classList.add('hidden');
};

// Close modal on click outside modal-content
document.getElementById('details-modal').addEventListener('click', function(event) {
  if (event.target === this) {
    hideDetails();
  }
});

// Close modal on Escape key press
document.addEventListener('keydown', function(event) {
  if (event.key === "Escape") {
    hideDetails();
  }
});

// Initialize
document.getElementById('year').textContent = new Date().getFullYear();
renderTimetable();
