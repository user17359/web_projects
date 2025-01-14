export class Leaderboard{
    leaderboardData = [
        { name: "Gracz1", score: 100 },
        { name: "Gracz2", score: 50 },
        { name: "Gracz3", score: 30 },
    ];

     reshuffle: () => {};

    showLeaderboard(playerName, playerScore) {
        this.leaderboardData.push({ name: playerName, score: playerScore });

        this.leaderboardData.sort((a, b) => a.score - b.score);

        this.leaderboardData = this.leaderboardData.slice(0, 10);

        let leaderboardBody = document.getElementById("leaderboard-body");
        leaderboardBody!.innerHTML = "";

        this.leaderboardData.forEach((entry, index) => {
            const minutes = Math.floor(entry.score / 60);
            const seconds = Math.floor(entry.score % 60);
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>${minutes}:${seconds < 10 ? '0' : ''}${seconds}</td>
            `;
            leaderboardBody!.appendChild(row);
        });

        document.getElementById("leaderboard")!.style.display = "block";

        document.getElementById("play-again")!.onclick = () => {
            this.reshuffle();
            document.getElementById("leaderboard")!.style.display = "none";
        };
    }
}