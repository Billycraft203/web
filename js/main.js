// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// 订单数据存储（使用localStorage持久化）
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// 初始化函数
function init() {
    // 初始化图表
    initChart();
    
    // 绑定事件
    bindEvents();
    
    // 生成订单号
    generateOrderNumber();
    
    // 初始化示例数据（仅用于演示，如果localStorage中没有数据）
    initSampleData();
    
    // 更新统计数据
    updateStats();
    
    console.log('微掌柜系统初始化完成');
}

// 初始化示例数据
function initSampleData() {
    // 如果已有数据，不再初始化
    if (orders.length > 0) {
        return;
    }
    
    // 创建一些示例订单用于演示
    const sampleOrders = [
        {
            orderNumber: 'WZG20251229001',
            customerName: '张三',
            customerPhone: '13800138000',
            customerAddress: '北京市朝阳区xxx街道xxx号',
            productName: '无线蓝牙耳机',
            quantity: 2,
            price: 199.00,
            totalAmount: 398.00,
            expressCompany: '顺丰速运',
            remark: '尽快发货',
            status: 'unprinted',
            createTime: '2025/12/29 10:30:00'
        },
        {
            orderNumber: 'WZG20251229002',
            customerName: '李四',
            customerPhone: '13900139000',
            customerAddress: '上海市浦东新区xxx路xxx号',
            productName: '智能手环',
            quantity: 1,
            price: 299.00,
            totalAmount: 299.00,
            expressCompany: '中通快递',
            remark: '',
            status: 'shipped',
            createTime: '2025/12/29 09:15:00'
        },
        {
            orderNumber: 'WZG20251229003',
            customerName: '王五',
            customerPhone: '13700137000',
            customerAddress: '广州市天河区xxx大道xxx号',
            productName: '机械键盘',
            quantity: 1,
            price: 599.00,
            totalAmount: 599.00,
            expressCompany: '圆通速递',
            remark: '需要开发票',
            status: 'completed',
            createTime: '2025/12/28 16:20:00'
        },
        {
            orderNumber: 'WZG20251229004',
            customerName: '赵六',
            customerPhone: '13600136000',
            customerAddress: '深圳市南山区xxx街xxx号',
            productName: '无线鼠标',
            quantity: 3,
            price: 89.00,
            totalAmount: 267.00,
            expressCompany: '韵达快递',
            remark: '',
            status: 'unpaid',
            createTime: '2025/12/29 11:00:00'
        }
    ];
    
    orders = sampleOrders;
    localStorage.setItem('orders', JSON.stringify(orders));
}

// 绑定事件
function bindEvents() {
    // 导航菜单点击事件
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 时间标签切换事件
    const timeTabs = document.querySelectorAll('.time-tab');
    timeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const parent = this.parentElement;
            parent.querySelectorAll('.time-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 搜索功能
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    // 菜单图标点击事件
    const menuIcon = document.querySelector('.menu-icon');
    if (menuIcon) {
        menuIcon.addEventListener('click', toggleSidebar);
    }
}

// 搜索功能
function performSearch() {
    const searchInput = document.querySelector('.search-box input');
    const keyword = searchInput.value.trim();
    
    if (keyword) {
        console.log('搜索关键词:', keyword);
        // 这里添加实际的搜索逻辑
        alert('搜索功能演示：搜索 "' + keyword + '"');
    } else {
        alert('请输入搜索关键词');
    }
}

// 切换侧边栏显示/隐藏
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// ========== 创建订单功能 ==========

// 打开创建订单模态框
function openCreateOrderModal() {
    const modal = document.getElementById('createOrderModal');
    modal.classList.add('show');
    generateOrderNumber();
}

// 关闭创建订单模态框
function closeCreateOrderModal() {
    const modal = document.getElementById('createOrderModal');
    modal.classList.remove('show');
    document.getElementById('createOrderForm').reset();
    generateOrderNumber();
}

// 生成订单号
function generateOrderNumber() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    const orderNumber = `WZG${year}${month}${day}${hours}${minutes}${seconds}${random}`;
    const orderNumberInput = document.getElementById('orderNumber');
    if (orderNumberInput) {
        orderNumberInput.value = orderNumber;
    }
    return orderNumber;
}

// 处理创建订单表单提交
document.addEventListener('DOMContentLoaded', function() {
    const createOrderForm = document.getElementById('createOrderForm');
    if (createOrderForm) {
        createOrderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(this);
            const order = {
                orderNumber: formData.get('orderNumber'),
                customerName: formData.get('customerName'),
                customerPhone: formData.get('customerPhone'),
                customerAddress: formData.get('customerAddress'),
                productName: formData.get('productName'),
                quantity: parseInt(formData.get('quantity')),
                price: parseFloat(formData.get('price')),
                totalAmount: parseInt(formData.get('quantity')) * parseFloat(formData.get('price')),
                expressCompany: formData.get('expressCompany'),
                remark: formData.get('remark'),
                status: 'unprinted',
                createTime: new Date().toLocaleString('zh-CN')
            };
            
            // 保存订单
            orders.push(order);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // 刷新图表和统计数据
            if (typeof refreshChartAndStats === 'function') {
                refreshChartAndStats();
            }
            
            // 显示成功消息
            alert('订单创建成功！订单号：' + order.orderNumber);
            
            // 关闭模态框并重置表单
            closeCreateOrderModal();
        });
    }
});

// ========== 订单列表功能 ==========

// 打开订单列表模态框
function openOrderListModal() {
    const modal = document.getElementById('orderListModal');
    modal.classList.add('show');
    loadOrders();
}

// 关闭订单列表模态框
function closeOrderListModal() {
    const modal = document.getElementById('orderListModal');
    modal.classList.remove('show');
}

// 加载订单列表
function loadOrders(filteredOrders = null) {
    const orderTableBody = document.getElementById('orderTableBody');
    const noOrderData = document.getElementById('noOrderData');
    const displayOrders = filteredOrders || orders;
    
    if (displayOrders.length === 0) {
        orderTableBody.innerHTML = '';
        noOrderData.style.display = 'block';
        return;
    }
    
    noOrderData.style.display = 'none';
    
    // 按创建时间倒序排列
    const sortedOrders = [...displayOrders].reverse();
    
    orderTableBody.innerHTML = sortedOrders.map(order => {
        const statusText = getStatusText(order.status);
        const statusClass = `status-${order.status}`;
        
        return `
            <tr>
                <td>${order.orderNumber}</td>
                <td>${order.customerName}</td>
                <td>${order.customerPhone}</td>
                <td>${order.productName}</td>
                <td>${order.quantity}</td>
                <td>¥${order.totalAmount.toFixed(2)}</td>
                <td><span class="order-status ${statusClass}">${statusText}</span></td>
                <td>${order.createTime}</td>
                <td>
                    <div class="order-actions">
                        <button class="btn-action" onclick="viewOrderDetail('${order.orderNumber}')">查看</button>
                        <button class="btn-action" onclick="printOrder('${order.orderNumber}')">打印</button>
                        <button class="btn-action danger" onclick="deleteOrder('${order.orderNumber}')">删除</button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'unpaid': '未支付',
        'unprinted': '未打印',
        'unshipped': '未发货',
        'shipped': '运输中',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return statusMap[status] || '未知';
}

// 筛选订单
function filterOrders() {
    const searchInput = document.getElementById('orderSearchInput').value.toLowerCase();
    const statusFilter = document.getElementById('orderStatusFilter').value;
    
    let filteredOrders = orders;
    
    // 按状态筛选
    if (statusFilter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }
    
    // 按关键词搜索
    if (searchInput) {
        filteredOrders = filteredOrders.filter(order => 
            order.orderNumber.toLowerCase().includes(searchInput) ||
            order.customerName.toLowerCase().includes(searchInput) ||
            order.customerPhone.includes(searchInput) ||
            order.productName.toLowerCase().includes(searchInput)
        );
    }
    
    loadOrders(filteredOrders);
}

// 查看订单详情
function viewOrderDetail(orderNumber) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (order) {
        const detail = `
订单号：${order.orderNumber}
收货人：${order.customerName}
联系电话：${order.customerPhone}
收货地址：${order.customerAddress}
商品名称：${order.productName}
数量：${order.quantity}
单价：¥${order.price.toFixed(2)}
总金额：¥${order.totalAmount.toFixed(2)}
快递公司：${order.expressCompany}
备注：${order.remark || '无'}
状态：${getStatusText(order.status)}
创建时间：${order.createTime}
        `;
        alert(detail);
    }
}

// 打印订单
function printOrder(orderNumber) {
    const order = orders.find(o => o.orderNumber === orderNumber);
    if (order) {
        // 更新订单状态
        order.status = 'unshipped';
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // 刷新图表和统计数据
        if (typeof refreshChartAndStats === 'function') {
            refreshChartAndStats();
        }
        
        alert(`订单 ${orderNumber} 已发送到打印机！`);
        loadOrders();
    }
}

// 删除订单
function deleteOrder(orderNumber) {
    if (confirm('确定要删除这个订单吗？')) {
        orders = orders.filter(o => o.orderNumber !== orderNumber);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // 刷新图表和统计数据
        if (typeof refreshChartAndStats === 'function') {
            refreshChartAndStats();
        }
        
        loadOrders();
        alert('订单已删除！');
    }
}

// 更新统计数据
function updateStats() {
    // 统计各状态订单数量
    const stats = {
        unprinted: 0,
        unshipped: 0,
        unpaid: 0,
        shipped: 0,
        completed: 0,
        cancelled: 0,
        total: orders.length
    };
    
    orders.forEach(order => {
        if (order.status in stats) {
            stats[order.status]++;
        }
    });
    
    // 更新页面显示
    const updateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    };
    
    updateElement('stat-unprinted', stats.unprinted);
    updateElement('stat-unshipped', stats.unshipped);
    updateElement('stat-unpaid', stats.unpaid);
    updateElement('stat-shipped', stats.shipped);
    updateElement('stat-completed', stats.completed);
    updateElement('stat-cancelled', stats.cancelled);
    updateElement('stat-total', stats.total);
}

// 刷新图表和统计数据（供其他函数调用）
function refreshChartAndStats() {
    updateStats();
    if (typeof updateChart === 'function') {
        updateChart();
    }
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const createModal = document.getElementById('createOrderModal');
    const listModal = document.getElementById('orderListModal');
    
    if (event.target === createModal) {
        closeCreateOrderModal();
    }
    if (event.target === listModal) {
        closeOrderListModal();
    }
};