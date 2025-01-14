export class Leaderboard{
    leaderboardData = [
        { name: "Gracz1", score: 50 },
        { name: "Gracz2", score: 10 },
        { name: "Gracz3", score: 5 },
    ];

     reshuffle: () => {};

    showLeaderboard(playerName, playerScore) {
        this.leaderboardData.push({ name: playerName, score: playerScore });

        this.leaderboardData.sort((a, b) => a.score - b.score);

        this.leaderboardData = this.leaderboardData.slice(0, 10);

        let leaderboardBody = document.getElementById("leaderboard-body");
        leaderboardBody!.innerHTML = "";

        this.leaderboardData.forEach((entry, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${entry.name}</td>
                <td>${entry.score}</td>
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