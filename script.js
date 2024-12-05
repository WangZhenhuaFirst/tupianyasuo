document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewArea = document.getElementById('previewArea');
    const originalImage = document.getElementById('originalImage');
    const compressedImage = document.getElementById('compressedImage');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    // 处理拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });

    // 处理点击上传
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // 处理图片文件
    function handleFiles(files) {
        if (files.length === 0) return;
        
        const file = files[0];
        if (!file.type.match('image.*')) {
            alert('请上传图片文件！');
            return;
        }

        // 显示原始图片大小
        originalSize.textContent = formatFileSize(file.size);

        // 预览原始图片
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImage.src = e.target.result;
            compressImage(e.target.result);
        };
        reader.readAsDataURL(file);

        previewArea.style.display = 'block';
    }

    // 压缩图片
    function compressImage(dataUrl) {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality.value / 100);
            compressedImage.src = compressedDataUrl;

            // 计算压缩后的大小
            const compressedSize = Math.round((compressedDataUrl.length - 'data:image/jpeg;base64,'.length) * 3/4);
            document.getElementById('compressedSize').textContent = formatFileSize(compressedSize);
        };
        img.src = dataUrl;
    }

    // 质量滑块事件
    quality.addEventListener('input', function() {
        qualityValue.textContent = this.value + '%';
        if (originalImage.src) {
            compressImage(originalImage.src);
        }
    });

    // 下载按钮事件
    downloadBtn.addEventListener('click', () => {
        if (!compressedImage.src) return;
        
        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = compressedImage.src;
        link.click();
    });

    // 文件大小格式化
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 