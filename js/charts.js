// 初始化图表
function initChart() {
    const canvas = document.getElementById('orderTrendChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // 设置canvas尺寸
    canvas.width = canvas.offsetWidth;
    canvas.height = 300;
    
    // 绘制简单的折线图
    drawLineChart(ctx, canvas.width, canvas.height);
    
    // 更新统计数据
    updateStatistics();
}

// 更新统计数据
function updateStatistics() {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // 获取今天的日期
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 获取7天前的日期
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);
    
    // 统计今日数据
    const todayOrders = orders.filter(order => {
        const orderDate = new Date(order.createTime);
        orderDate.setHours(0, 0, 0, 0);
        return orderDate.getTime() === today.getTime();
    });
    
    // 统计近7日数据
    const last7DaysOrders = orders.filter(order => {
        const orderDate = new Date(order.createTime);
        return orderDate >= sevenDaysAgo;
    });
    
    // 更新今日统计
    const todayStats = document.querySelectorAll('.stats-grid')[0];
    if (todayStats) {
        const statItems = todayStats.querySelectorAll('.stat-item');
        statItems[0].querySelector('.stat-number').textContent = 
            todayOrders.filter(o => o.status === 'unprinted').length; // 未打印
        statItems[1].querySelector('.stat-number').textContent = 
            todayOrders.filter(o => o.status === 'unshipped').length; // 未发货
        statItems[2].querySelector('.stat-number').textContent = 
            todayOrders.filter(o => o.status === 'preprint').length; // 预打印
        statItems[3].querySelector('.stat-number').textContent = 
            todayOrders.filter(o => o.status === 'printed' || o.status === 'unshipped').length; // 已打印
    }
    
    // 更新近7日统计
    const last7DaysStats = document.querySelectorAll('.stats-grid')[1];
    if (last7DaysStats) {
        const statItems = last7DaysStats.querySelectorAll('.stat-item');
        statItems[0].querySelector('.stat-number').textContent = 
            last7DaysOrders.filter(o => o.status === 'shipped').length; // 运输中
        statItems[1].querySelector('.stat-number').textContent = 
            last7DaysOrders.filter(o => o.status === 'completed').length; // 已签收
        statItems[2].querySelector('.stat-number').textContent = 
            last7DaysOrders.filter(o => o.status === 'cancelled').length; // 已取消
    }
}

// 绘制折线图
function drawLineChart(ctx, width, height) {
    // 从localStorage获取真实订单数据
    const data = getOrderDataForChart(7);
    
    // 清空canvas
    ctx.clearRect(0, 0, width, height);
    
    // 设置样式
    ctx.strokeStyle = '#1890ff';
    ctx.lineWidth = 2;
    ctx.fillStyle = 'rgba(24, 144, 255, 0.1)';
    
    // 计算坐标
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const valueRange = maxValue - minValue || 1;
    
    // 绘制坐标轴
    ctx.beginPath();
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    
    // Y轴刻度线
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
    }
    ctx.stroke();
    
    // 绘制数据线和填充
    ctx.beginPath();
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    // 描边
    ctx.strokeStyle = '#1890ff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 填充区域
    ctx.lineTo(width - padding, padding + chartHeight);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.closePath();
    ctx.fill();
    
    // 绘制数据点
    ctx.fillStyle = '#1890ff';
    data.forEach((value, index) => {
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // 绘制刻度标签
    ctx.fillStyle = '#999';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // X轴标签（显示几个日期）
    for (let i = 0; i < 6; i++) {
        const index = Math.floor((data.length - 1) / 5 * i);
        const x = padding + (chartWidth / (data.length - 1)) * index;
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        const label = `${date.getMonth() + 1}/${date.getDate()}`;
        ctx.fillText(label, x, height - 15);
    }
    
    // Y轴标签
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = minValue + (valueRange / 5) * (5 - i);
        const y = padding + (chartHeight / 5) * i;
        ctx.fillText(Math.round(value), padding - 10, y + 5);
    }
}

// 从localStorage获取订单数据用于图表显示
function getOrderDataForChart(days) {
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    const data = [];
    const today = new Date();
    
    // 统计每天的订单数量
    for (let i = days - 1; i >= 0; i--) {
        const targetDate = new Date();
        targetDate.setDate(today.getDate() - i);
        targetDate.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);
        
        // 计算该日期的订单数量
        const count = orders.filter(order => {
            const orderDate = new Date(order.createTime);
            return orderDate >= targetDate && orderDate < nextDate;
        }).length;
        
        data.push(count);
    }
    
    return data;
}

// 刷新图表和统计数据
function refreshChartAndStats() {
    const canvas = document.getElementById('orderTrendChart');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        drawLineChart(ctx, canvas.width, canvas.height);
    }
    updateStatistics();
}