export class Counter{
    count = 0
    countActive = false;

    startCounter() {
       this.countActive = true;
    }

    updateCounter() {
        this.count += 1;
        const counterDisplay = document.getElementById('counter');
        counterDisplay!.innerText = `${this.count}`;
    }

    stopCounter() {
        this.countActive = false;
    }

    resetCounter() {
        this.count = 0;
        const timerDisplay = document.getElementById('counter');
        timerDisplay!.innerText = `${this.count}`;
    }
}