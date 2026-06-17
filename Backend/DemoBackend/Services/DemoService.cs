using DemoBackend.Models;

namespace DemoBackend.Services
{
    public class DemoService
    {
        // Collections: Sử dụng List
        private readonly List<Activity> _activities = new List<Activity>
        {
            new Activity { Id = 1, Name = "Học Angular", Category = "Study", Score = 90 },
            new Activity { Id = 2, Name = "Chơi Game", Category = "Play", Score = 85 },
            new Activity { Id = 3, Name = "Đọc sách", Category = "Study", Score = 95 },
            new Activity { Id = 4, Name = "Ngủ", Category = "Rest", Score = 50 }
        };

        // Async/Await: Xử lý bất đồng bộ
        public async Task<List<Activity>> GetTopStudyActivitiesAsync()
        {
            // Giả lập hệ thống đang bận xử lý (1 giây)
            await Task.Delay(1000);

            // LINQ: Lọc Category là Study và sắp xếp điểm từ cao xuống thấp
            var result = _activities
                .Where(a => a.Category == "Study")
                .OrderByDescending(a => a.Score)
                .ToList();

            return result;
        }
    }
}