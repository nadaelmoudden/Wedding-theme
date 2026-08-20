(() => {
  "use strict";


  /* =========================================================
     HELPERS
  ========================================================= */

  const prefersReducedMotion =
    window
      .matchMedia(
        "(prefers-reduced-motion: reduce)"
      )
      .matches;


  const qs = (
    selector,
    parent = document
  ) => {

    return parent
      .querySelector(
        selector
      );

  };


  const qsa = (
    selector,
    parent = document
  ) => {

    return [
      ...parent
        .querySelectorAll(
          selector
        )
    ];

  };


  const sleep = (
    ms
  ) => {

    return new Promise(
      resolve => {

        setTimeout(
          resolve,
          ms
        );

      }
    );

  };


  function playAnimation(
    element,
    keyframes,
    options
  ) {

    if (
      !element ||
      prefersReducedMotion
    ) {

      return Promise.resolve();

    }


    const animation =
      element.animate(
        keyframes,
        {
          fill: "forwards",
          ...options
        }
      );


    return animation
      .finished
      .catch(
        () => undefined
      );

  }


  /* =========================================================
     MUSIC
  ========================================================= */

  const bgMusic =
    qs(
      "#bgMusic"
    );


  async function startMusic() {

    if (
      !bgMusic ||
      !bgMusic.paused
    ) {

      return;

    }


    try {

      bgMusic.volume =
        0.08;


      await bgMusic.play();


      fadeAudio(
        bgMusic,
        0.38,
        1600
      );

    }

    catch {

      /*
       * Modern browsers can block autoplay.
       * The invitation continues normally.
       */

    }

  }


  function fadeAudio(
    audio,
    targetVolume,
    duration
  ) {

    if (!audio) return;


    const startVolume =
      audio.volume;


    const startedAt =
      performance.now();


    function step(now) {

      const progress =
        Math.min(
          1,
          (
            now -
            startedAt
          )
          /
          duration
        );


      audio.volume =
        startVolume +
        (
          targetVolume -
          startVolume
        )
        *
        progress;


      if (
        progress < 1
      ) {

        requestAnimationFrame(
          step
        );

      }

    }


    requestAnimationFrame(
      step
    );

  }


  /* =========================================================
     OPENING ELEMENTS
  ========================================================= */

  const opening =
    qs(
      "#opening"
    );


  const stage =
    qs(
      "#stage"
    );


  const closedPlane =
    qs(
      "#closedPlane"
    );


  const glowPlane =
    qs(
      "#glowPlane"
    );


  const openPlane =
    qs(
      "#openPlane"
    );


  const flap3d =
    qs(
      "#flap3d"
    );


  const openSeal =
    qs(
      "#openSeal"
    );


  const tapLabel =
    qs(
      "#tapLabel"
    );


  const goldWash =
    qs(
      "#goldWash"
    );


  const openingFlash =
    qs(
      "#openingFlash"
    );


  const sparkField =
    qs(
      "#sparkField"
    );


  const openConfirmation =
    qs(
      "#openConfirmation"
    );


  const openingEdge =
    qs(
      "#openingEdge"
    );


  const detailsPage =
    qs(
      "#detailsPage"
    );


  let invitationIsOpening =
    false;


  /* =========================================================
     SPARKS
  ========================================================= */

  function createSparks(
    amount = 42
  ) {

    if (
      !sparkField ||
      !openSeal
    ) {

      return;

    }


    const sealRect =
      openSeal
        .getBoundingClientRect();


    const originX =
      sealRect.left +
      sealRect.width / 2;


    const originY =
      sealRect.top +
      sealRect.height / 2;


    for (
      let index = 0;
      index < amount;
      index += 1
    ) {

      const spark =
        document
          .createElement(
            "i"
          );


      spark.className =
        "spark";


      sparkField
        .appendChild(
          spark
        );


      const angle =
        Math.random()
        *
        Math.PI
        *
        2;


      const distance =
        70 +
        Math.random()
        *
        260;


      const x =
        originX +
        Math.cos(angle)
        *
        distance;


      const y =
        originY +
        Math.sin(angle)
        *
        distance;


      const scale =
        0.55 +
        Math.random()
        *
        1.35;


      const duration =
        850 +
        Math.random()
        *
        600;


      spark.style.left =
        `${originX}px`;


      spark.style.top =
        `${originY}px`;


      spark.animate(

        [

          {
            opacity: 0,

            transform:
              `
                translate(
                  -50%,
                  -50%
                )
                scale(
                  ${scale * 0.4}
                )
              `
          },

          {
            opacity:
              0.95,

            offset:
              0.16
          },

          {
            opacity:
              0,

            transform:
              `
                translate(
                  ${x - originX}px,
                  ${y - originY}px
                )
                scale(0)
              `
          }

        ],

        {

          duration,

          easing:
            "cubic-bezier(.2,.8,.2,1)",

          fill:
            "forwards"

        }

      )
      .finished
      .finally(
        () => {

          spark.remove();

        }
      );

    }

  }


  /* =========================================================
     OPEN INVITATION
  ========================================================= */

  async function openInvitation() {

    if (
      invitationIsOpening ||
      !opening ||
      !stage ||
      !openSeal ||
      !detailsPage
    ) {

      return;

    }


    invitationIsOpening =
      true;


    openSeal.disabled =
      true;


    /* Vibration */

    if (
      navigator.vibrate
    ) {

      navigator.vibrate(
        [
          30,
          25,
          45
        ]
      );

    }


    /* Start audio */

    startMusic();


    /* First particles */

    createSparks(
      50
    );


    /*
     * Make website visible
     * behind the opening screen.
     */

    detailsPage
      .classList
      .add(
        "visible"
      );


    /* Reduced motion */

    if (
      prefersReducedMotion
    ) {

      opening.style.display =
        "none";


      document.body.style.overflow =
        "auto";


      revealVisibleItems();


      return;

    }


    /* =====================================================
       STEP 1
       LABEL + SEAL PRESS
    ====================================================== */

    await Promise.all(

      [

        playAnimation(

          tapLabel,

          [

            {
              opacity:
                1,

              transform:
                `
                  translateX(-50%)
                  translateY(0)
                `
            },

            {
              opacity:
                0,

              transform:
                `
                  translateX(-50%)
                  translateY(12px)
                `
            }

          ],

          {
            duration:
              280,

            easing:
              "ease-out"
          }

        ),


        playAnimation(

          openSeal,

          [

            {
              transform:
                `
                  translate(
                    -50%,
                    -50%
                  )
                  scale(1)
                `
            },

            {
              transform:
                `
                  translate(
                    -50%,
                    -50%
                  )
                  scale(.76)
                `,

              offset:
                0.32
            },

            {
              transform:
                `
                  translate(
                    -50%,
                    -50%
                  )
                  scale(1.08)
                `
            }

          ],

          {
            duration:
              520,

            easing:
              "cubic-bezier(.2,.8,.2,1)"
          }

        )

      ]

    );


    /* =====================================================
       STEP 2
       GOLD LIGHT
    ====================================================== */

    await Promise.all(

      [

        playAnimation(

          goldWash,

          [
            {
              opacity:
                0
            },

            {
              opacity:
                0.92
            }
          ],

          {
            duration:
              900,

            easing:
              "ease-out"
          }

        ),


        playAnimation(

          glowPlane,

          [
            {
              opacity:
                0
            },

            {
              opacity:
                1
            }
          ],

          {
            duration:
              900,

            easing:
              "ease-in-out"
          }

        ),


        playAnimation(

          openingFlash,

          [

            {
              opacity:
                0
            },

            {
              opacity:
                0.35,

              offset:
                0.45
            },

            {
              opacity:
                0.08
            }

          ],

          {
            duration:
              1000,

            easing:
              "ease-in-out"
          }

        )

      ]

    );


    createSparks(
      28
    );


    /* =====================================================
       STEP 3
       OPEN ENVELOPE
    ====================================================== */

    flap3d.style.opacity =
      "1";


    await Promise.all(

      [

        playAnimation(

          openPlane,

          [

            {
              opacity:
                0,

              transform:
                "scale(1.015)"
            },

            {
              opacity:
                1,

              transform:
                "scale(1.008)"
            }

          ],

          {
            duration:
              850,

            easing:
              "ease-in-out"
          }

        ),


        playAnimation(

          closedPlane,

          [
            {
              opacity:
                1
            },

            {
              opacity:
                0
            }
          ],

          {
            duration:
              850,

            easing:
              "ease-in-out"
          }

        ),


        playAnimation(

          flap3d,

          [

            {
              opacity:
                1,

              transform:
                `
                  rotateX(0deg)
                  translateZ(30px)
                `
            },

            {
              opacity:
                1,

              transform:
                `
                  rotateX(-178deg)
                  translateZ(-62px)
                `,

              offset:
                0.88
            },

            {
              opacity:
                0,

              transform:
                `
                  rotateX(-178deg)
                  translateZ(-62px)
                `
            }

          ],

          {
            duration:
              1800,

            easing:
              "cubic-bezier(.42,0,.18,1)"
          }

        ),


        playAnimation(

          openSeal,

          [

            {
              opacity:
                1,

              top:
                "50.9%",

              transform:
                `
                  translate(
                    -50%,
                    -50%
                  )
                  scale(1.08)
                `
            },

            {
              opacity:
                1,

              top:
                "32%",

              transform:
                `
                  translate(
                    -50%,
                    -50%
                  )
                  scale(.82)
                `,

              offset:
                0.58
            },

            {
              opacity:
                0,

              top:
                "30%",

              transform:
                `
                  translate(
                    -50%,
                    -50%
                  )
                  scale(.65)
                `
            }

          ],

          {
            duration:
              1500,

            easing:
              "cubic-bezier(.3,.8,.2,1)"
          }

        )

      ]

    );


    /* =====================================================
       STEP 4
       OPENED MESSAGE
    ====================================================== */

    await playAnimation(

      openConfirmation,

      [

        {
          opacity:
            0,

          transform:
            `
              translate(
                -50%,
                18px
              )
            `
        },

        {
          opacity:
            1,

          transform:
            `
              translate(
                -50%,
                0
              )
            `
        }

      ],

      {
        duration:
          450,

        easing:
          "ease-out"
      }

    );


    await sleep(
      520
    );


    /* =====================================================
       STEP 5
       ENABLE WEBSITE
    ====================================================== */

    document.body.style.overflow =
      "auto";


    window.scrollTo(
      0,
      0
    );


    revealVisibleItems();


    /* =====================================================
       STEP 6
       OPENING SCREEN MOVES UP
    ====================================================== */

    await Promise.all(

      [

        playAnimation(

          openConfirmation,

          [

            {
              opacity:
                1,

              transform:
                `
                  translate(
                    -50%,
                    0
                  )
                `
            },

            {
              opacity:
                0,

              transform:
                `
                  translate(
                    -50%,
                    -10px
                  )
                `
            }

          ],

          {
            duration:
              300,

            easing:
              "ease-in"
          }

        ),


        playAnimation(

          openingEdge,

          [

            {
              opacity:
                0
            },

            {
              opacity:
                0.76
            },

            {
              opacity:
                0
            }

          ],

          {
            duration:
              1200,

            easing:
              "ease-in-out"
          }

        ),


        playAnimation(

          opening,

          [

            {
              transform:
                `
                  translateY(0)
                  rotateX(0deg)
                  scale(1)
                `,

              opacity:
                1
            },

            {
              transform:
                `
                  translateY(-106%)
                  rotateX(5deg)
                  scale(.985)
                `,

              opacity:
                1
            }

          ],

          {
            duration:
              1600,

            easing:
              "cubic-bezier(.65,0,.2,1)"
          }

        )

      ]

    );


    opening.style.display =
      "none";

  }


  /* =========================================================
     OPENING ENTRANCE
  ========================================================= */

  if (
    stage &&
    !prefersReducedMotion
  ) {

    stage.animate(

      [

        {
          opacity:
            0,

          transform:
            `
              translateY(24px)
              scale(.93)
              rotateX(4deg)
            `
        },

        {
          opacity:
            1,

          transform:
            `
              translateY(0)
              scale(1)
              rotateX(0deg)
            `
        }

      ],

      {

        duration:
          1300,

        delay:
          120,

        easing:
          "cubic-bezier(.2,.8,.2,1)",

        fill:
          "both"

      }

    );

  }


  /* Open click */

  if (
    openSeal
  ) {

    openSeal
      .addEventListener(
        "click",
        openInvitation
      );

  }


  /* =========================================================
     OPENING DESKTOP PARALLAX
  ========================================================= */

  if (
    stage
  ) {

    window
      .addEventListener(

        "pointermove",

        event => {

          if (
            invitationIsOpening ||
            prefersReducedMotion ||
            window.innerWidth < 800
          ) {

            return;

          }


          const rotateX =
            (
              event.clientY /
              innerHeight -
              0.5
            )
            *
            -3.5;


          const rotateY =
            (
              event.clientX /
              innerWidth -
              0.5
            )
            *
            5;


          stage.style.transform =
            `
              rotateX(
                ${rotateX}deg
              )

              rotateY(
                ${rotateY}deg
              )
            `;

        }

      );

  }


  /* =========================================================
     REVEAL ON SCROLL
  ========================================================= */

  const revealItems =
    qsa(
      ".reveal"
    );


  const revealObserver =
    new IntersectionObserver(

      (
        entries,
        observer
      ) => {

        entries.forEach(

          entry => {

            if (
              !entry.isIntersecting
            ) {

              return;

            }


            entry
              .target
              .classList
              .add(
                "visible"
              );


            observer
              .unobserve(
                entry.target
              );

          }

        );

      },

      {

        threshold:
          0.12,

        rootMargin:
          "0px 0px -6% 0px"

      }

    );


  revealItems
    .forEach(

      item => {

        revealObserver
          .observe(
            item
          );

      }

    );


  function revealVisibleItems() {

    revealItems
      .forEach(

        item => {

          const rect =
            item
              .getBoundingClientRect();


          if (
            rect.top <
            innerHeight * 0.92
            &&
            rect.bottom > 0
          ) {

            item
              .classList
              .add(
                "visible"
              );


            revealObserver
              .unobserve(
                item
              );

          }

        }

      );

  }


  /* =========================================================
     VENUE SLIDER
  ========================================================= */

  const venueSlider =
    qs(
      "#venueSlider"
    );


  if (
    venueSlider
  ) {

    const slides =
      qsa(
        ".venue-slide",
        venueSlider
      );


    const dots =
      qsa(
        ".venue-dot",
        venueSlider
      );


    const previousButton =
      qs(
        ".venue-prev",
        venueSlider
      );


    const nextButton =
      qs(
        ".venue-next",
        venueSlider
      );


    let currentIndex =
      0;


    let autoPlayTimer =
      null;


    let touchStartX =
      0;


    /* =============================================
       UPDATE SLIDER
    ============================================= */

    function updateVenueSlider() {

      const total =
        slides.length;


      if (
        !total
      ) {

        return;

      }


      const previousIndex =
        (
          currentIndex -
          1 +
          total
        )
        %
        total;


      const nextIndex =
        (
          currentIndex +
          1
        )
        %
        total;


      slides
        .forEach(

          (
            slide,
            index
          ) => {

            slide
              .classList
              .toggle(
                "active",
                index === currentIndex
              );


            slide
              .classList
              .toggle(
                "prev",
                index === previousIndex
              );


            slide
              .classList
              .toggle(
                "next",
                index === nextIndex
              );

          }

        );


      dots
        .forEach(

          (
            dot,
            index
          ) => {

            dot
              .classList
              .toggle(
                "active",
                index === currentIndex
              );

          }

        );

    }


    /* =============================================
       NEXT
    ============================================= */

    function showNextVenue() {

      currentIndex =
        (
          currentIndex +
          1
        )
        %
        slides.length;


      updateVenueSlider();

    }


    /* =============================================
       PREVIOUS
    ============================================= */

    function showPreviousVenue() {

      currentIndex =
        (
          currentIndex -
          1 +
          slides.length
        )
        %
        slides.length;


      updateVenueSlider();

    }


    /* =============================================
       AUTOPLAY
    ============================================= */

    function stopVenueAutoplay() {

      if (
        autoPlayTimer
      ) {

        clearInterval(
          autoPlayTimer
        );


        autoPlayTimer =
          null;

      }

    }


    function startVenueAutoplay() {

      stopVenueAutoplay();


      if (
        !prefersReducedMotion &&
        slides.length > 1
      ) {

        autoPlayTimer =
          setInterval(
            showNextVenue,
            5200
          );

      }

    }


    /* =============================================
       BUTTON EVENTS
    ============================================= */

    previousButton
      ?.addEventListener(

        "click",

        () => {

          showPreviousVenue();

          startVenueAutoplay();

        }

      );


    nextButton
      ?.addEventListener(

        "click",

        () => {

          showNextVenue();

          startVenueAutoplay();

        }

      );


    /* =============================================
       DOT EVENTS
    ============================================= */

    dots
      .forEach(

        dot => {

          dot
            .addEventListener(

              "click",

              () => {

                currentIndex =
                  Number(
                    dot.dataset.index
                  )
                  ||
                  0;


                updateVenueSlider();


                startVenueAutoplay();

              }

            );

        }

      );


    /* =============================================
       DESKTOP HOVER
    ============================================= */

    venueSlider
      .addEventListener(
        "mouseenter",
        stopVenueAutoplay
      );


    venueSlider
      .addEventListener(
        "mouseleave",
        startVenueAutoplay
      );


    /* =============================================
       MOBILE SWIPE
    ============================================= */

    venueSlider
      .addEventListener(

        "touchstart",

        event => {

          touchStartX =
            event
              .changedTouches[0]
              .clientX;

        },

        {
          passive:
            true
        }

      );


    venueSlider
      .addEventListener(

        "touchend",

        event => {

          const touchEndX =
            event
              .changedTouches[0]
              .clientX;


          const difference =
            touchEndX -
            touchStartX;


          if (
            Math.abs(
              difference
            )
            <
            45
          ) {

            return;

          }


          if (
            difference > 0
          ) {

            showPreviousVenue();

          }

          else {

            showNextVenue();

          }


          startVenueAutoplay();

        },

        {
          passive:
            true
        }

      );


    updateVenueSlider();


    startVenueAutoplay();

  }


  /* =========================================================
     GENERIC 3D TILT
  ========================================================= */

  function attachTilt(

    element,

    {
      strength = 8,
      lift = 8,
      onMove = null,
      onLeave = null
    } = {}

  ) {

    if (
      !element
    ) {

      return;

    }


    element
      .addEventListener(

        "mousemove",

        event => {

          if (
            prefersReducedMotion ||
            window.innerWidth < 800 ||
            !window
              .matchMedia(
                "(pointer: fine)"
              )
              .matches
          ) {

            return;

          }


          const rect =
            element
              .getBoundingClientRect();


          const x =
            (
              event.clientX -
              rect.left
            )
            /
            rect.width
            -
            0.5;


          const y =
            (
              event.clientY -
              rect.top
            )
            /
            rect.height
            -
            0.5;


          element.style.transform =
            `
              perspective(1400px)

              rotateX(
                ${y * -strength}deg
              )

              rotateY(
                ${x * strength}deg
              )

              translateY(
                -${lift}px
              )
            `;


          onMove?.(
            {
              x,
              y
            }
          );

        }

      );


    element
      .addEventListener(

        "mouseleave",

        () => {

          element.style.transform =
            "";


          onLeave?.();

        }

      );

  }


  /* =========================================================
     MAIN WEDDING CARD 3D
  ========================================================= */

  const weddingCard =
    qs(
      "#weddingCard"
    );


  const photoScene =
    weddingCard
      ?
      qs(
        ".photo-scene",
        weddingCard
      )
      :
      null;


  const floatingNames =
    weddingCard
      ?
      qs(
        ".floating-names",
        weddingCard
      )
      :
      null;


  const contentPanel =
    weddingCard
      ?
      qs(
        ".lux-content-panel",
        weddingCard
      )
      :
      null;


  attachTilt(

    weddingCard,

    {

      strength:
        7,

      lift:
        7,


      onMove:
        (
          {
            x,
            y
          }
        ) => {

          if (
            photoScene
          ) {

            photoScene.style.transform =
              `
                translate3d(
                  ${x * -16}px,
                  ${y * -13}px,
                  70px
                )

                rotateX(
                  ${y * 4}deg
                )

                rotateY(
                  ${x * -5}deg
                )
              `;

          }


          if (
            floatingNames
          ) {

            floatingNames.style.transform =
              `
                translate3d(
                  ${x * 20}px,
                  ${y * 13}px,
                  175px
                )
              `;

          }


          if (
            contentPanel
          ) {

            contentPanel.style.transform =
              `
                translate3d(
                  ${x * 6}px,
                  ${y * 5}px,
                  38px
                )
              `;

          }

        },


      onLeave:
        () => {

          if (
            photoScene
          ) {

            photoScene.style.transform =
              "";

          }


          if (
            floatingNames
          ) {

            floatingNames.style.transform =
              "";

          }


          if (
            contentPanel
          ) {

            contentPanel.style.transform =
              "";

          }

        }

    }

  );


  /* =========================================================
     INFO CARD TILT
  ========================================================= */

  qsa(
    ".tilt-card"
  )
  .forEach(

    card => {

      attachTilt(

        card,

        {
          strength:
            9,

          lift:
            10
        }

      );

    }

  );


  /* =========================================================
     COUNTDOWN BOX TILT
  ========================================================= */

  qsa(
    ".countdown-box"
  )
  .forEach(

    box => {

      attachTilt(

        box,

        {
          strength:
            10,

          lift:
            8
        }

      );

    }

  );


  /* =========================================================
     NOTE CARD TILT
  ========================================================= */

  qsa(
    ".note-card"
  )
  .forEach(

    card => {

      attachTilt(

        card,

        {
          strength:
            8,

          lift:
            8
        }

      );

    }

  );


  /* =========================================================
     NOTES SCENE PARALLAX
  ========================================================= */

  const notesScene =
    qs(
      "#notesScene"
    );


  if (
    notesScene
  ) {

    notesScene
      .addEventListener(

        "mousemove",

        event => {

          if (
            prefersReducedMotion ||
            window.innerWidth < 1000 ||
            !window
              .matchMedia(
                "(pointer: fine)"
              )
              .matches
          ) {

            return;

          }


          const rect =
            notesScene
              .getBoundingClientRect();


          const x =
            (
              event.clientX -
              rect.left
            )
            /
            rect.width
            -
            0.5;


          const y =
            (
              event.clientY -
              rect.top
            )
            /
            rect.height
            -
            0.5;


          notesScene.style.transform =
            `
              perspective(1800px)

              rotateX(
                ${y * -3}deg
              )

              rotateY(
                ${x * 4}deg
              )
            `;

        }

      );


    notesScene
      .addEventListener(

        "mouseleave",

        () => {

          notesScene.style.transform =
            "";

        }

      );

  }


  /* =========================================================
     COUNTDOWN
  ========================================================= */

  const WEDDING_DATE =
    new Date(
      "2026-12-31T19:00:00+01:00"
    )
    .getTime();


  const countdownElements =
    {

      days:
        qs(
          "#countdownDays"
        ),

      hours:
        qs(
          "#countdownHours"
        ),

      minutes:
        qs(
          "#countdownMinutes"
        ),

      seconds:
        qs(
          "#countdownSeconds"
        )

    };


  const previousCountdownValues =
    {

      days:
        null,

      hours:
        null,

      minutes:
        null,

      seconds:
        null

    };


  function formatCountdownValue(
    value
  ) {

    return String(
      value
    )
    .padStart(
      2,
      "0"
    );

  }


  function renderCountdownValue(
    key,
    value
  ) {

    const element =
      countdownElements[key];


    if (
      !element
    ) {

      return;

    }


    const formatted =
      formatCountdownValue(
        value
      );


    if (
      previousCountdownValues[key]
      ===
      formatted
    ) {

      return;

    }


    element.textContent =
      formatted;


    previousCountdownValues[key] =
      formatted;


    if (
      !prefersReducedMotion
    ) {

      element
        .classList
        .remove(
          "number-change"
        );


      void element.offsetWidth;


      element
        .classList
        .add(
          "number-change"
        );

    }

  }


  function updateCountdown() {

    const difference =
      Math.max(
        0,
        WEDDING_DATE -
        Date.now()
      );


    const days =
      Math.floor(
        difference /
        86_400_000
      );


    const hours =
      Math.floor(
        (
          difference %
          86_400_000
        )
        /
        3_600_000
      );


    const minutes =
      Math.floor(
        (
          difference %
          3_600_000
        )
        /
        60_000
      );


    const seconds =
      Math.floor(
        (
          difference %
          60_000
        )
        /
        1_000
      );


    renderCountdownValue(
      "days",
      days
    );


    renderCountdownValue(
      "hours",
      hours
    );


    renderCountdownValue(
      "minutes",
      minutes
    );


    renderCountdownValue(
      "seconds",
      seconds
    );

  }


  if (
    Object
      .values(
        countdownElements
      )
      .every(Boolean)
  ) {

    updateCountdown();


    setInterval(
      updateCountdown,
      1000
    );

  }


  /* =========================================================
     COUNTDOWN STARS
  ========================================================= */

  const countdownStars =
    qs(
      "#countdownStars"
    );


  if (
    countdownStars
  ) {

    const starCount =
      window.innerWidth < 600
        ?
        18
        :
        30;


    for (
      let index = 0;
      index < starCount;
      index += 1
    ) {

      const star =
        document
          .createElement(
            "i"
          );


      star.style.left =
        `${
          Math.random() *
          100
        }%`;


      star.style.top =
        `${
          Math.random() *
          100
        }%`;


      star.style
        .setProperty(
          "--duration",
          `${
            3 +
            Math.random() *
            4
          }s`
        );


      star.style
        .setProperty(
          "--delay",
          `${
            Math.random() *
            -5
          }s`
        );


      countdownStars
        .appendChild(
          star
        );

    }

  }


  /* =========================================================
     MAP PLACEHOLDER
  ========================================================= */

  const locationButton =
    qs(
      ".location-btn"
    );


  if (
    locationButton
      ?.getAttribute(
        "href"
      )
    ===
    "#"
  ) {

    locationButton
      .addEventListener(

        "click",

        event => {

          event
            .preventDefault();

        }

      );

  }


  /* =========================================================
     RESIZE CLEANUP
  ========================================================= */

  window
    .addEventListener(

      "resize",

      () => {

        if (
          window.innerWidth <
          800
        ) {

          if (
            stage
          ) {

            stage.style.transform =
              "";

          }


          if (
            weddingCard
          ) {

            weddingCard.style.transform =
              "";

          }


          if (
            notesScene
          ) {

            notesScene.style.transform =
              "";

          }


          qsa(
            `
              .tilt-card,
              .countdown-box,
              .note-card
            `
          )
          .forEach(

            element => {

              element.style.transform =
                "";

            }

          );

        }

      }

    );

})();