const matches = [
  {
    player1: "Sneha",
    player2: "Arjun",
    winner: "Arjun",
    margin: "18 runs",
  },
  {
    player1: "Ravi",
    player2: "Kunal",
    winner: "Ravi",
    margin: "12 runs",
  },
  {
    player1: "Maya",
    player2: "Neha",
    winner: "Neha",
    margin: "6 runs",
  },
];

export default function CareerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-pink-600 flex flex-col items-center py-10 px-4">
      <h1 className="text-4xl font-bold text-white mb-10">Match History</h1>

      <div className="space-y-6 w-full max-w-3xl">
        {matches.map((match, index) => {
          const loser =
            match.player1 === match.winner ? match.player2 : match.player1;

          return (
            <div
              key={index}
              className="flex justify-between items-center rounded-xl shadow-lg overflow-hidden"
            >
              {/* Player 1 */}
              <div className="flex-1 bg-red-600 text-white font-bold text-lg text-center py-4">
                {match.player1}
              </div>

              {/* Result */}
              <div className="flex-none bg-white text-gray-900 px-6 py-2 text-sm font-semibold">
                {match.winner} WIN
                <br />
                BY {match.margin.toUpperCase()}
              </div>

              {/* Player 2 */}
              <div className="flex-1 bg-blue-600 text-white font-bold text-lg text-center py-4">
                {match.player2}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
