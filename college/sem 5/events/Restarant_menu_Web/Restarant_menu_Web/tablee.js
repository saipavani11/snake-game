// JavaScript remains the same as in previous version
        let selectedDate = null;
        let selectedTable = null;
        const reservedTables = {
            fourSeater: [1, 4],
            sixSeater: [2, 5]
        };

        const calendar = {
            currentDate: new Date(),
            selectedDate: null,

            init() {
                this.renderCalendar();
                document.getElementById('prevMonth').addEventListener('click', () => {
                    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
                    this.renderCalendar();
                });
                document.getElementById('nextMonth').addEventListener('click', () => {
                    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
                    this.renderCalendar();
                });
            },

            renderCalendar() {
                const year = this.currentDate.getFullYear();
                const month = this.currentDate.getMonth();
                const firstDay = new Date(year, month, 1);
                const lastDay = new Date(year, month + 1, 0);
                const today = new Date();

                document.getElementById('currentMonth').textContent = 
                    `${this.currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

                const calendarGrid = document.getElementById('calendarGrid');
                calendarGrid.innerHTML = '';

                // Add day headers
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                days.forEach(day => {
                    const dayHeader = document.createElement('div');
                    dayHeader.textContent = day;
                    dayHeader.className = 'calendar-day header';
                    calendarGrid.appendChild(dayHeader);
                });

                // Add empty cells for days before first day of month
                for (let i = 0; i < firstDay.getDay(); i++) {
                    const emptyDay = document.createElement('div');
                    emptyDay.className = 'calendar-day';
                    calendarGrid.appendChild(emptyDay);
                }

                // Add days of month
                for (let day = 1; day <= lastDay.getDate(); day++) {
                    const dateCell = document.createElement('div');
                    dateCell.textContent = day;
                    dateCell.className = 'calendar-day';

                    const currentDate = new Date(year, month, day);
                    if (currentDate < today) {
                        dateCell.classList.add('disabled');
                    } else {
                        dateCell.addEventListener('click', () => this.selectDate(currentDate, dateCell));
                    }

                    if (this.selectedDate && 
                        currentDate.toDateString() === this.selectedDate.toDateString()) {
                        dateCell.classList.add('selected');
                    }

                    calendarGrid.appendChild(dateCell);
                }
            },

            selectDate(date, element) {
                const selected = document.querySelector('.calendar-day.selected');
                if (selected) selected.classList.remove('selected');
                
                element.classList.add('selected');
                this.selectedDate = date;
                selectedDate = date;
                updateConfirmButton();
            }
        };

        function createTableGrid(containerId, seaterType, count) {
            const container = document.getElementById(containerId);
            // const isForSeater = seaterType === 'fourSeater';
            
            for (let i = 1; i <= count; i++) {
                const button = document.createElement('button');
                button.className = 'table-button';
                button.innerHTML = `Table ${i}`;

                const isReserved = reservedTables[seaterType].includes(i);
                if (isReserved) {
                    button.classList.add('reserved');
                } else {
                    button.classList.add('available');
                    button.addEventListener('click', () => selectTable(button, `${seaterType}-${i}`));
                }

                container.appendChild(button);
            }
        }

        function selectTable(button, tableId) {
            const selected = document.querySelector('.table-button.selected');
            if (selected) selected.classList.remove('selected');

            button.classList.add('selected');
            selectedTable = tableId;
            updateConfirmButton();
        }

        function updateConfirmButton() {
            const confirmButton = document.getElementById('confirmButton');
            confirmButton.disabled = !(selectedDate && selectedTable);
        }

        document.addEventListener('DOMContentLoaded', () => {
            calendar.init();
            createTableGrid('fourSeaterGrid', 'fourSeater', 6);
            createTableGrid('sixSeaterGrid', 'sixSeater', 6);

            document.getElementById('confirmButton').addEventListener('click', () => {
                if (selectedDate && selectedTable) {
                    alert(`Booking confirmed for ${selectedTable} on ${selectedDate.toLocaleDateString()}`);
                }
            });
        });