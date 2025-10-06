document.addEventListener('DOMContentLoaded', () => {
    const openingScreen = document.getElementById('opening-screen');
    const calendarScreen = document.getElementById('calendar-screen');
    const startButton = document.getElementById('start-button');

    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthYear = document.getElementById('current-month-year');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');

    let currentDate = new Date();

    const MOON_PHASES = [
        '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'
    ];
    
    // 朔望月（新月から新月までの周期）
    const SYNODIC_MONTH = 29.53058867;
    // 基準日（2000年1月6日）のユリウス日
    const J2000 = 2451545.0;

    // 月齢を計算する関数
    function getMoonAge(date) {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // 1-12
        const day = date.getDate();

        // ユリウス日を計算
        const a = Math.floor((14 - month) / 12);
        const y = year + 4800 - a;
        const m = month + 12 * a - 3;
        const julianDay = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

        // J2000.0 (2000年1月1日12:00 UTC) からの日数
        const daysSinceJ2000 = julianDay - J2000;
        
        // 月齢の計算
        const moonAge = (daysSinceJ2000 % SYNODIC_MONTH + SYNODIC_MONTH) % SYNODIC_MONTH;
        return moonAge;
    }

    // 月齢から月の満ち欠けの絵文字を返す関数
    function getMoonPhaseEmoji(moonAge) {
        // 月齢0-29.53...を8段階に分ける
        const phaseIndex = Math.floor(moonAge / (SYNODIC_MONTH / 8));
        return MOON_PHASES[phaseIndex] || '⚫'; // 範囲外の場合は黒丸
    }

    // カレンダーを生成する関数
    function renderCalendar() {
        calendarGrid.innerHTML = ''; // カレンダーをクリア
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-11

        currentMonthYear.textContent = `${year}年 ${month + 1}月`;

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0); // 翌月の0日目 = 今月の最終日
        const numDays = lastDayOfMonth.getDate(); // 今月の日数
        const firstDayOfWeek = firstDayOfMonth.getDay(); // 0(日) - 6(土)

        // 月の初めまでの空白を生成
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('day', 'empty');
            calendarGrid.appendChild(emptyDay);
        }

        // 月の各日を生成
        for (let day = 1; day <= numDays; day++) {
            const date = new Date(year, month, day);
            const moonAge = getMoonAge(date);
            const moonEmoji = getMoonPhaseEmoji(moonAge);
            
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            dayDiv.innerHTML = `<span class="day-number">${day}</span><span class="moon-phase">${moonEmoji}</span>`;
            
            calendarGrid.appendChild(dayDiv);
        }
    }

    // イベントリスナー
    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    startButton.addEventListener('click', () => {
        openingScreen.classList.remove('active');
        calendarScreen.classList.add('active');
        renderCalendar(); // カレンダー画面表示後に初期描画
    });

    // 初期表示：オープニング画面をアクティブに
    openingScreen.classList.add('active');
});
