// ==UserScript==
// @name			Image Downloader
// @namespace		https://openuserjs.org/users/mikhailsdv
// @version			0.1
// @description		Shows download button on every image on the page by pressing Ctrl + Q
// @author			Misha Saidov
// @license			MIT
// @match			https://*/*
// @match			http://*/*
// @icon			https://i.ibb.co/XxcFQVC/logo.png
// @author			Misha Saidov
// @grant			none
// ==/UserScript==

(function() {
	"use strict";

	window.focus();

	const listenCombination = ({combination, callback, once, element = window}) => {
		let combinationMemory = [];
		let emptyTimeout;
		let count = 0;

		const onKeyUp = e => {
			combinationMemory = combinationMemory.filter(item => item !== e.code);
			emptyTimeout = setTimeout(() => {
				combinationMemory = [];
			}, 500);
		}
		const onKeyDown = e => {
			clearTimeout(emptyTimeout);
			if (!combinationMemory.includes(e.code)) {
				combinationMemory.push(e.code);
			}
			if (combination.every((item, index) => item === combinationMemory[index])) {
				if (once) {
					element.removeEventListener("keydown", onKeyDown);
					element.removeEventListener("keyup", onKeyUp);
				}
				callback(++count);
			}
		}

		element.addEventListener("keyup", onKeyUp);
		element.addEventListener("keydown", onKeyDown);
	};

	const appendButton = ({
		width,
		height,
		top,
		left,
		element,
		url,
		fileName
	}) => {
		let button = document.createElement("button");
		let size = 20;
		let styles;
		if (!document.querySelector("style[data-download-image-button-styles]")) {
			styles = document.createElement("style");
			styles.setAttribute("data-download-image-button-styles", "");
			styles.innerHTML = `
				[data-download-image-button] {
					z-index: 99999;
					position: absolute;
					border: none;
					outline: none;
					padding: 0;
					margin: 0;
					cursor: pointer;
					background-color: white;
					opacity: 0.5;
					background-size: 60%;
					background-position: center;
					background-repeat: no-repeat;
					background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDQ5MiA0OTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ5MiA0OTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnPg0KCTxnPg0KCQk8cGF0aCBkPSJNNDQyLjY2OCwyNjguNTM2bC0xNi4xMTYtMTYuMTJjLTUuMDYtNS4wNjgtMTEuODI0LTcuODcyLTE5LjAyNC03Ljg3MmMtNy4yMDgsMC0xNC41ODQsMi44MDQtMTkuNjQ0LDcuODcyDQoJCQlMMjgzLjY4OCwzNTUuOTkyVjI2LjkyNEMyODMuNjg4LDEyLjA4NCwyNzIuODU2LDAsMjU4LjAyLDBoLTIyLjgwNGMtMTQuODMyLDAtMjguNDA0LDEyLjA4NC0yOC40MDQsMjYuOTI0djMzMC4yNA0KCQkJTDEwMi44MjQsMjUyLjQxNmMtNS4wNjgtNS4wNjgtMTEuNDQ0LTcuODcyLTE4LjY1Mi03Ljg3MmMtNy4yLDAtMTMuNzc2LDIuODA0LTE4Ljg0LDcuODcybC0xNi4wMjgsMTYuMTINCgkJCWMtMTAuNDg4LDEwLjQ5Mi0xMC40NDQsMjcuNTYsMC4wNDQsMzguMDUybDE3Ny41NzYsMTc3LjU1NmM1LjA1Niw1LjA1NiwxMS44NCw3Ljg1NiwxOS4xLDcuODU2aDAuMDc2DQoJCQljNy4yMDQsMCwxMy45NzItMi44LDE5LjAyOC03Ljg1NmwxNzcuNTQtMTc3LjU1MkM0NTMuMTY0LDI5Ni4xMDQsNDUzLjE2NCwyNzkuMDI4LDQ0Mi42NjgsMjY4LjUzNnoiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8L3N2Zz4NCg==");
					border-radius: 100%;
					height: ${size}px;
					min-width: ${size}px;
					min-height: ${size}px;
					width: ${size}px;
					box-shadow: 0 0 0 rgba(0, 0, 0, 0.3);
					transition: all .2s ease-out;
				}
				[data-download-image-button]:hover {
					transform: scale(1.2);
					opacity: 1;
					box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
				}
				[data-download-image-button]:active {
					transform: scale(1.1);
					opacity: 1;
					box-shadow: 0 0 6px rgba(0, 0, 0, 0.3);
				}
			`;
			document.head.appendChild(styles);
		}

		button.style.top = top + (height / 2) - (size / 2) + "px";
		button.style.left = left + (width / 2) - (size / 2) + "px";
		button.setAttribute("data-download-image-button", "");
		button.addEventListener("click", e => {
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation();
			downloadFile(fileName, url);
		});
		element.prepend(button);
	}

	const toDataURL = url => {
		return fetch(url).then(response => {
			return response.blob();
		}).then(blob => {
			return URL.createObjectURL(blob);
		});
	}

	async function downloadFile(fileName, src) {
		const a = document.createElement("a");
		a.href = await toDataURL(src);
		a.download = fileName;
		document.body.appendChild(a);
		a.click();
		a.remove();
	}

	const getFileName = url => {
		if (/^data:image\/([a-zA-Z0-9]+)/.test(url)) {
			let extension = url.match(/^data:image\/([a-zA-Z0-9]+)/);
			return "image." + extension[1];
		}
		else {
			let match = url.match(/^.*\/(.+?)(\?.+?)?$/);
			if (match && match[1]) {
				return match[1];
			}
			else {
				return "image.jpg";
			}
		}
	}

	listenCombination({
		combination: ["ControlLeft", "KeyQ"],
		callback: count => {
			if (count % 2 === 0) {
				Array.from(document.querySelectorAll("[data-download-image-button]")).forEach(element => element.remove());
				return;
			}

			Array.from(document.querySelectorAll("*:not(img)")).forEach(element => {
				if (element.offsetParent) {
					let computedStyle = getComputedStyle(element);
					let match = computedStyle.backgroundImage.match(/^url\(['"](.+?)['"]\)/);

					if (match && match[1]) {
						appendButton({
							top: element.offsetTop,
							left: element.offsetLeft,
							width: element.offsetWidth,
							height: element.offsetHeight,
							element: element.offsetParent,
							url: match[1],
							fileName: getFileName(match[1])
						});
					}
				}
			});

			Array.from(document.getElementsByTagName("img")).forEach(element => {
				if (element.offsetParent) {
					appendButton({
						top: element.offsetTop,
						left: element.offsetLeft,
						width: element.offsetWidth,
						height: element.offsetHeight,
						element: element.offsetParent,
						url: element.src,
						fileName: getFileName(element.src)
					});
				}
			});
		},
		once: false
	});
})();