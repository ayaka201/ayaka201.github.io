gsap.registerPlugin(ScrollToPlugin, ScrollTrigger);

/* Main navigation */
let panelsSection = document.querySelector("#panels"),
	panelsContainer = document.querySelector("#panels-container"),
	tween;
document.querySelectorAll(".anchor").forEach(anchor => {
	anchor.addEventListener("click", function(e) {
		e.preventDefault();
		let targetElem = document.querySelector(e.target.getAttribute("href")),
			y = targetElem;
		if (targetElem && panelsContainer.isSameNode(targetElem.parentElement)) {
			let totalScroll = tween.scrollTrigger.end - tween.scrollTrigger.start,
				totalMovement = (panels.length - 1) * targetElem.offsetWidth;
			y = Math.round(tween.scrollTrigger.start + (targetElem.offsetLeft / totalMovement) * totalScroll);
		}
		gsap.to(window, {
			scrollTo: {
				y: y,
				autoKill: false
			},
			duration: 1
		});
	});
});



/* Panels */
const panels = gsap.utils.toArray("#panels-container .panel");
tween = gsap.to(panels, {
	xPercent: -100 * ( panels.length - 1 ),
	ease: "none",
	scrollTrigger: {
		trigger: "#panels-container",
		pin: true,
		start: "top top",
		scrub: 1,
		snap: {
			snapTo: 1 / (panels.length - 1),
			inertia: false,
			duration: {min: 0.1, max: 0.1}
		},
		end: () =>  "+=" + (panelsContainer.offsetWidth - innerWidth)
	}
});

console.clear();

gsap.utils.toArray(".stb_line_single").forEach((line, i) => {
  const speed = 2; 

  const links = line.querySelectorAll("a"),
    tl = horizontalLoop(links, { speed: speed, reversed: true, repeat: -1 });

  links.forEach((link) => {
    link.addEventListener("mouseenter", () =>
      gsap.to(tl, { timeScale: 0, overwrite: true })
    );
    link.addEventListener("mouseleave", () =>
      gsap.to(tl, { timeScale: -1, overwrite: true })
    );
  });
});

function horizontalLoop(items, config) {
  items = gsap.utils.toArray(items);
  config = config || {};
  let tl = gsap.timeline({
      repeat: config.repeat,
      paused: config.paused,
      defaults: { ease: "none" },
      onReverseComplete: () => tl.totalTime(tl.rawTime() + tl.duration() * 100)
    }),
    length = items.length,
    startX = items[0].offsetLeft,
    times = [],
    widths = [],
    xPercents = [],
    curIndex = 0,
    pixelsPerSecond = (config.speed || 1) * 100,
    snap = config.snap === false ? (v) => v : gsap.utils.snap(config.snap || 1), 
    totalWidth,
    curX,
    distanceToStart,
    distanceToLoop,
    item,
    i;
  gsap.set(items, {
    
    xPercent: (i, el) => {
      let w = (widths[i] = parseFloat(gsap.getProperty(el, "width", "px")));
      xPercents[i] = snap(
        (parseFloat(gsap.getProperty(el, "x", "px")) / w) * 100 +
          gsap.getProperty(el, "xPercent")
      );
      return xPercents[i];
    }
  });
  gsap.set(items, { x: 0 });
  totalWidth =
    items[length - 1].offsetLeft +
    (xPercents[length - 1] / 100) * widths[length - 1] -
    startX +
    items[length - 1].offsetWidth *
      gsap.getProperty(items[length - 1], "scaleX") +
    (parseFloat(config.paddingRight) || 0);
  for (i = 0; i < length; i++) {
    item = items[i];
    curX = (xPercents[i] / 100) * widths[i];
    distanceToStart = item.offsetLeft + curX - startX;
    distanceToLoop =
      distanceToStart + widths[i] * gsap.getProperty(item, "scaleX");
    tl.to(
      item,
      {
        xPercent: snap(((curX - distanceToLoop) / widths[i]) * 100),
        duration: distanceToLoop / pixelsPerSecond
      },
      0
    )
      .fromTo(
        item,
        {
          xPercent: snap(
            ((curX - distanceToLoop + totalWidth) / widths[i]) * 100
          )
        },
        {
          xPercent: xPercents[i],
          duration:
            (curX - distanceToLoop + totalWidth - curX) / pixelsPerSecond,
          immediateRender: false
        },
        distanceToLoop / pixelsPerSecond
      )
      .add("label" + i, distanceToStart / pixelsPerSecond);
    times[i] = distanceToStart / pixelsPerSecond;
  }
  function toIndex(index, vars) {
    vars = vars || {};
    Math.abs(index - curIndex) > length / 2 &&
      (index += index > curIndex ? -length : length); 
    let newIndex = gsap.utils.wrap(0, length, index),
      time = times[newIndex];
    if (time > tl.time() !== index > curIndex) {
      vars.modifiers = { time: gsap.utils.wrap(0, tl.duration()) };
      time += tl.duration() * (index > curIndex ? 1 : -1);
    }
    curIndex = newIndex;
    vars.overwrite = true;
    return tl.tweenTo(time, vars);
  }
  tl.next = (vars) => toIndex(curIndex + 1, vars);
  tl.previous = (vars) => toIndex(curIndex - 1, vars);
  tl.current = () => curIndex;
  tl.toIndex = (index, vars) => toIndex(index, vars);
  tl.times = times;
  tl.progress(1, true).progress(0, true); // pre-render for performance
  if (config.reversed) {
    tl.vars.onReverseComplete();
    tl.reverse();
  }
  return tl;
}

/*card*/

document.addEventListener("DOMContentLoaded", function() {
  const cards = document.querySelectorAll('.card');
  const prevButton = document.getElementById('prevPage');
  const nextButton = document.getElementById('nextPage');
  
  let currentPage = 0; 
  
  showPage(currentPage); 
  
  prevButton.addEventListener('click', function() {
      if (currentPage > 0) {
          currentPage--;
          showPage(currentPage);
      }
  });
  
  nextButton.addEventListener('click', function() {
      if (currentPage < Math.ceil(cards.length / 2) - 1) {
          currentPage++;
          showPage(currentPage);
      }
  });
  
  function showPage(page) {
      
      cards.forEach(function(card) {
          card.style.display = 'none';
      });
      
      const startIndex = page * 4;
      const endIndex = startIndex + 4;
      
      
      for (let i = startIndex; i < endIndex && i < cards.length; i++) {
          cards[i].style.display = 'block';
      }
  }
});




  /*timeline*/
  document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.timeline-button');
    const contentDisplay = document.getElementById('content-display');
    const itemsToShow = 5;

    function updateTimeline(index) {
        const startIndex = Math.max(0, index - Math.floor(itemsToShow / 2));
        buttons.forEach((button, i) => {
            const parent = button.parentElement;
            if (i >= startIndex && i < startIndex + itemsToShow) {
                parent.classList.add('active');
            } else {
                parent.classList.remove('active');
            }
        });
    }

    buttons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const content = this.parentElement.getAttribute('data-content');
            contentDisplay.textContent = content;
            updateTimeline(index);

            buttons.forEach(btn => {
                btn.style.color = '#000'; 
                btn.style.fontSize = '20px'; 
            });

            this.style.color = '#FFB90F'; 
            this.style.fontSize = '50px'; 
        });
    });

    updateTimeline(0);

    buttons[0].click();
});

/*Tower Of Hanoi*/

document.addEventListener('DOMContentLoaded', () => {
  const towers = document.querySelectorAll('.tower');
  const disks = [5,4,3,2,1].map(size => createDisk(size));
  let selectedDisk = null;
  let moves = 0;
  const messageElement = document.getElementById('message');

  towers[0].append(...disks);

  towers.forEach(tower => {
      tower.addEventListener('click', () => {
          if (selectedDisk) {
              if (canPlaceDisk(tower, selectedDisk)) {
                  tower.appendChild(selectedDisk);
                  selectedDisk = null;
                  moves++;
                  checkGameEnd();
              }
          } else {
              selectedDisk = tower.lastElementChild;
              if (selectedDisk) {
                  tower.removeChild(selectedDisk);
              }
          }
      });
  });

  function createDisk(size) {
      const disk = document.createElement('div');
      disk.classList.add('disk');
      disk.style.width = `${size * 30}px`;
      disk.dataset.size = size;
      return disk;
  }

  function canPlaceDisk(tower, disk) {
      const topDisk = tower.lastElementChild;
      if (!topDisk || topDisk.dataset.size > disk.dataset.size) {
          return true;
      }
      return false;
  }

  function checkGameEnd() {
      if (towers[1].children.length === 5 || towers[2].children.length === 5) {
          messageElement.textContent = `恭喜過關 總共移動了 ${moves} 步`;
          towers.forEach(tower => {
              tower.replaceWith(tower.cloneNode(true)); 
          });
      }
  }
});

/*contact me */

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", function(event) {
      event.preventDefault(); 
      alert("已經送出！");
      form.reset();
  });
});
