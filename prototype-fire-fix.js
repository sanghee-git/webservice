(function() {
    'use strict';

    function applyPrototypeFix() {
        // Prototype.js가 로드되었는지 확인
        if (typeof Event === 'undefined' || typeof Event.fire !== 'function') {
            return;
        }

        // 이미 패치가 적용되었는지 확인
        if (Event._firePatched) {
            return;
        }

        var originalEventFire = Event.fire;

        Event.fire = function(element, eventName, memo, bubble) {
            // element가 null, undefined이거나 dispatchEvent가 없는 경우 처리
            if (!element) {
                console.warn('[Prototype.js Fix] Event.fire: element is null or undefined');
                return null;
            }

            if (typeof element.dispatchEvent !== 'function') {
                console.warn('[Prototype.js Fix] Event.fire: element does not support dispatchEvent', element);
                return element;
            }

            try {
                return originalEventFire.call(this, element, eventName, memo, bubble);
            } catch (e) {
                console.error('[Prototype.js Fix] Event.fire error:', e.message);
                return element;
            }
        };

        Event._firePatched = true;

        // Element.Methods.fire도 패치 (Element에서 fire 호출 시)
        if (typeof Element !== 'undefined' && Element.Methods && Element.Methods.fire) {
            var originalElementFire = Element.Methods.fire;

            Element.Methods.fire = function(element, eventName, memo, bubble) {
                if (!element) {
                    console.warn('[Prototype.js Fix] Element.fire: element is null or undefined');
                    return null;
                }

                if (typeof element.dispatchEvent !== 'function') {
                    console.warn('[Prototype.js Fix] Element.fire: element does not support dispatchEvent');
                    return element;
                }

                try {
                    return originalElementFire.call(this, element, eventName, memo, bubble);
                } catch (e) {
                    console.error('[Prototype.js Fix] Element.fire error:', e.message);
                    return element;
                }
            };
        }
    }

    // DOM이 로드된 후 패치 적용
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPrototypeFix);
    } else {
        // DOM이 이미 로드된 경우
        applyPrototypeFix();
    }

    // window load 시에도 재확인 (안전장치)
    window.addEventListener('load', applyPrototypeFix);
})();

// app/design/frontend/Philip/theme/web/js/prototype-fire-fix.js


///////////////////////////1st
(function() {
    'use strict';

    function applyPrototypeFix() {
        if (typeof Event === 'undefined' || typeof Event.fire !== 'function') {
            return;
        }

        if (Event._firePatched) {
            return;
        }

        // Helper: dispatchEvent가 없는 객체에 더미 함수 부여
        function ensureDispatchEvent(element) {
            if (element && typeof element.dispatchEvent !== 'function') {
                element.dispatchEvent = function() {
                    return true; // 뉴렐릭이 호출했을 때 에러 없이 정상 통과하도록 더미 함수 주입
                };
            }
        }

        var originalEventFire = Event.fire;

        Event.fire = function(element, eventName, memo, bubble) {
            if (!element) {
                return null;
            }

            // dispatchEvent 함수가 없으면 안전하게 주입
            ensureDispatchEvent(element);

            try {
                return originalEventFire.call(this, element, eventName, memo, bubble);
            } catch (e) {
                console.error('[Prototype.js Fix] Event.fire error:', e.message);
                return element;
            }
        };

        Event._firePatched = true;

        if (typeof Element !== 'undefined' && Element.Methods && Element.Methods.fire) {
            var originalElementFire = Element.Methods.fire;

            Element.Methods.fire = function(element, eventName, memo, bubble) {
                if (!element) {
                    return null;
                }

                ensureDispatchEvent(element);

                try {
                    return originalElementFire.call(this, element, eventName, memo, bubble);
                } catch (e) {
                    console.error('[Prototype.js Fix] Element.fire error:', e.message);
                    return element;
                }
            };
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyPrototypeFix);
    } else {
        applyPrototypeFix();
    }

    window.addEventListener('load', applyPrototypeFix);
})();
