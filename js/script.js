document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search-input');
    const suggestions = document.getElementById('suggestions');
    const searchButton = document.getElementById('search-button');
    const startCourseButtons = document.querySelectorAll('.start-course-btn');

    // Tìm kiếm với AJAX
    searchInput.addEventListener('input', function () {
        const query = this.value;
        if (query.length > 0) {
            fetch('courses.json')
                .then(response => response.json())
                .then(data => {
                    suggestions.innerHTML = '';
                    const filteredCourses = data.filter(course => course.name.toLowerCase().includes(query.toLowerCase()));
                    filteredCourses.forEach(course => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.textContent = course.name;
                        suggestionItem.classList.add('suggestion-item');
                        suggestionItem.onclick = () => {
                            searchInput.value = course.name;
                            suggestions.innerHTML = '';
                        };
                        suggestions.appendChild(suggestionItem);
                    });
                });
        } else {
            suggestions.innerHTML = '';
        }
    });

    searchButton.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    function performSearch() {
        const query = searchInput.value;
        // Thực hiện tìm kiếm
        toastr.info('Tìm kiếm cho: ' + query);
        suggestions.innerHTML = ''; // Xóa gợi ý
    }

    // Bắt đầu khóa học
    startCourseButtons.forEach(button => {
        button.addEventListener('click', function () {
            const courseName = this.closest('.course-card').getAttribute('data-course');
            checkLoginAndStartCourse(courseName);
        });
    });

    function checkLoginAndStartCourse(courseName) {
        const isLoggedIn = false; // Kiểm tra trạng thái đăng nhập
        if (!isLoggedIn) {
            toastr.error('Bạn cần đăng nhập để bắt đầu khóa học!');
            window.location.href = 'login.html'; // Chuyển hướng đến trang đăng nhập
        } else {
            toastr.success('Bắt đầu khóa học: ' + courseName);
            // Logic để bắt đầu khóa học
        }
    }

    // Chuyển đổi tab
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContent = document.getElementById('tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tab = this.getAttribute('data-tab');
            switchTab(tab);
        });
    });

    function switchTab(tab) {
        // Ẩn tất cả nội dung tab
        const allContent = tabContent.children;
        Array.from(allContent).forEach(content => content.classList.remove('active'));

        // Hiện nội dung tab đã chọn
        const activeTabContent = document.createElement('div');
        activeTabContent.classList.add('tab-content', 'active');
        activeTabContent.textContent = `Nội dung cho tab: ${tab}`;
        tabContent.appendChild(activeTabContent);
    }

    // Sự kiện cho các tab bằng phím tab
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Tab' && e.target.classList.contains('tab-button')) {
            e.preventDefault(); // Ngăn không cho chuyển đổi focus
            const nextButton = tabButtons[(Array.from(tabButtons).indexOf(e.target) + 1) % tabButtons.length];
            nextButton.focus();
        }
    });
});

    // Xử lý sự kiện login
    // Các biến chọn phần tử
let login = document.querySelector(".login");
let create = document.querySelector(".create");
let container = document.querySelector(".container");
let loginButton = document.querySelector('.signin input[type="submit"]');
let signupButton = document.querySelector('.signup input[type="submit"]');
let forgotPasswordLink = document.querySelector('.forgot-password');

let users = JSON.parse(localStorage.getItem("users")) || []; // Lấy danh sách người dùng từ localStorage

// Chuyển đổi giữa đăng ký và đăng nhập
login.onclick = function() {
  container.classList.add("signinForm");
};
create.onclick = function() {
  container.classList.remove("signinForm");
};

// Hàm để xác thực người dùng
const authenticateUser = (usernameOrEmail, password) => {
    return users.find(user => 
        (user.username === usernameOrEmail || user.email === usernameOrEmail) && user.password === password
    );
};

// Thêm sự kiện cho nút đăng ký
signupButton.onclick = function(event) {
    event.preventDefault();
    const username = document.getElementById("signup-username").value.trim();
    const email = document.getElementById("signup-email").value.trim();
    const password = document.getElementById("signup-password").value.trim();
    const confirmPassword = document.getElementById("signup-confirm-password").value.trim();

    if (!username || !email || !password || !confirmPassword) {
        showMessage("Vui lòng điền đầy đủ thông tin.", false);
        return;
    }

    if (password !== confirmPassword) {
        showMessage("Mật khẩu không khớp.", false);
        return;
    }

    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        showMessage("Tên người dùng hoặc email đã tồn tại.", false);
        return;
    }

    users.push({ username, email, password });
    localStorage.setItem("users", JSON.stringify(users));
    showMessage("Tài khoản đã được tạo! Bạn có thể đăng nhập ngay.", true);
    container.classList.remove("signinForm"); // Quay về form đăng nhập
};

// Thêm sự kiện cho nút đăng nhập
loginButton.onclick = function(event) {
    event.preventDefault(); // Ngăn chặn gửi biểu mẫu
    const usernameOrEmail = document.getElementById("login-username-email").value.trim();
    const password = document.getElementById("login-password").value.trim();

    // Kiểm tra thông tin đăng nhập
    if (!usernameOrEmail || !password) {
        alert("Vui lòng nhập tên người dùng/email và mật khẩu.");
        return;
    }

    const user = authenticateUser(usernameOrEmail, password);

    if (user) {
        // Chuyển đến trang index.html
        window.location.href = '../pages/index.html';
    } else {
        alert("Tên người dùng hoặc mật khẩu không đúng!"); // Thông báo lỗi
    }
};

// Thêm sự kiện cho liên kết "Quên mật khẩu"
forgotPasswordLink.onclick = function(event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định
    const usernameOrEmail = prompt("Nhập tên người dùng hoặc email đã đăng ký:");

    if (!usernameOrEmail) {
        alert("Vui lòng nhập thông tin!");
        return;
    }

    const user = users.find(user => user.username === usernameOrEmail || user.email === usernameOrEmail);

    if (user) {
        // Giả sử gửi email để đặt lại mật khẩu
        alert(`Một liên kết đặt lại mật khẩu đã được gửi đến ${user.email}.`);
    } else {
        alert("Không tìm thấy tài khoản với thông tin đã nhập.");
    }
};

    //Scipt của user-profile
    function openTab(evt, tabName) {
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => content.classList.remove('active'));

        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => button.classList.remove('active'));

        document.getElementById(tabName).classList.add('active');
        evt.currentTarget.classList.add('active');
    }
// Script cho tab
// const tabs = document.querySelectorAll('.nav-item');
// const slider = document.querySelector('.slider');
// const tabContainer = document.querySelector('.nav-tab');

// function updateSlider() {
//     const activeTab = document.querySelector('.nav-item.active');
//     const tabRect = activeTab.getBoundingClientRect();
//     const containerRect = tabContainer.getBoundingClientRect();
//     const offset = tabRect.left - containerRect.left;

//     slider.style.left = `${offset}px`;
//     slider.style.width = `${tabRect.width}px`;

// }

// tab.forEach((tab) => {
//     tab.addEventListener('click', function() {
//         tab.forEach(t => t.classList.remove('active'));
//         this.classList.add('active');
//         updateSlider();
//     });
// });

// updateSlider();