(function () {
    const WebGUIPro_animation_Loading_1 = ["WebGUIPro_animation_Loading_1", (Control) => {
        const div = document.createElement("div");
        div.innerHTML =
            `
<div class="WebGUIPro_animation_Loading_1_spinner">
  <div class="WebGUIPro_animation_Loading_1_dot1"></div>
  <div class="WebGUIPro_animation_Loading_1_dot2"></div>
</div>
        `;
        const style = document.createElement("style");
        style.innerHTML = 
        `
.WebGUIPro_animation_Loading_1_spinner {
  margin: 100px auto;
  width: 40px;
  height: 40px;
  position: relative;
  text-align: center;

  -webkit-animation: WebGUIPro_animation_Loading_1_sk-rotate 2.0s infinite linear;
  animation: WebGUIPro_animation_Loading_1_sk-rotate 2.0s infinite linear;
}

.WebGUIPro_animation_Loading_1_dot1, .WebGUIPro_animation_Loading_1_dot2 {
  width: 60%;
  height: 60%;
  display: inline-block;
  position: absolute;
  top: 0;
  background-color: #333;
  border-radius: 100%;

  -webkit-animation: WebGUIPro_animation_Loading_1_sk-bounce 2.0s infinite ease-in-out;
  animation: WebGUIPro_animation_Loading_1_sk-bounce 2.0s infinite ease-in-out;
}

.WebGUIPro_animation_Loading_1_dot2 {
  top: auto;
  bottom: 0;
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes WebGUIPro_animation_Loading_1_sk-rotate { 100% { -webkit-transform: rotate(360deg) }}
@keyframes WebGUIPro_animation_Loading_1_sk-rotate { 100% { transform: rotate(360deg); -webkit-transform: rotate(360deg) }}

@-webkit-keyframes WebGUIPro_animation_Loading_1_sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes WebGUIPro_animation_Loading_1_sk-bounce {
  0%, 100% {
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% {
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
        `;
        div.appendChild(style);
        Control.appendChild(div);

        Control.wEnd = () => {
            Control.style.opacity = "0";
            Control.style.scale = "0";
            setTimeout(() => {
                Control.wDelete();
            }, 500);
        }
    }];

    
    WebGUIPro._Animation_List.push(WebGUIPro_animation_Loading_1);
})();