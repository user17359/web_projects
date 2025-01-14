export class Timer{
    timerInterval: NodeJS.Timeout;
    startTime: number;
    isTimerRunning = false;
    currentTime = 0;

    startTimer() {
        if (!this.isTimerRunning) {
            this.startTime = Date.now();
            this.isTimerRunning = true;
            
            this.timerInterval = setInterval(() => this.updateTimer(), 100);
        }
    }

    updateTimer() {
        if (!this.isTimerRunning) return;

        const elapsedTime = Date.now() - this.startTime;
        this.currentTime = elapsedTime;
        const seconds = Math.floor((elapsedTime / 1000) % 60);
        const minutes = Math.floor((elapsedTime / 1000 / 60) % 60);
        const timerDisplay = document.getElementById('timer');
        timerDisplay!.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    stopTimer() {
        clearInterval(this.timerInterval);
        this.isTimerRunning = false;
    }
}