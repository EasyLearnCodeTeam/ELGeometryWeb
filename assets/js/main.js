$(function() {
    var scene, camera, renderer, points = {};
    var keywords = ['hinh_vuong', 'hinh_chu_nhat', 'hinh_chop', 'hinh_tam_giac', 'vuong_goc', 'goc', 'mat_phang', 'song_song'];
    var keywordData = $.map(keywords, function(name, i) {
        var rv = {
            'name': name,
            'displayName': '',
            'insertTpl': '',
            'displayTpl': '',
            'hello': 'hi',
        }
        switch (name) {
            case 'hinh_vuong':
                rv['displayName'] = 'Hình vuông';
                rv['iconName'] = 'egl-hinhvuong';
                rv['insertTpl'] = '<span data-elg-name="hinh_vuong"><span class="elg-icon egl-hinhvuong"></span> <input class="elg-input" type="text" required placeholder="ABCD"></input></span>';
                break;
            case 'hinh_chu_nhat':
                rv['displayName'] = 'Hình chữ nhật	';
                rv['iconName'] = 'egl-hinhchunhat';
                rv['insertTpl'] = '<span data-elg-name="hinh_chu_nhat"><i class="elg-icon egl-hinhchunhat"></i> <input class="elg-input" type="text" required placeholder="ABCD"></input></span>';
                break;
            case 'hinh_chop':
                rv['displayName'] = 'Hình chóp';
                rv['iconName'] = 'egl-hinhchop';
                rv['insertTpl'] = '<span data-elg-name="hinh_chop"><i class="elg-icon egl-hinhchop"></i> <input class="elg-input" type="text" required placeholder="S.ABCD"></input></span>';
                break;
            case 'hinh_tam_giac':
                rv['displayName'] = 'Hình tam giác';
                rv['iconName'] = 'egl-tamgiac';
                rv['insertTpl'] = '<span data-elg-name="tam_giac"><i class="elg-icon egl-tamgiac"></i> <input class="elg-input" type="text" required placeholder="ABC"></input></span>';
                break;
            case 'vuong_goc':
                rv['displayName'] = 'Vuông góc';
                rv['iconName'] = 'egl-vuonggoc';
                rv['insertTpl'] = '<span data-elg-name="vuong_goc"><input class="elg-input" type="text" required placeholder="AB"></input> <i class="elg-icon egl-vuonggoc"></i> <input class="elg-input" type="text" required placeholder="CD"></input></span>';
                break;
            case 'goc':
                rv['displayName'] = 'Góc';
                rv['iconName'] = 'egl-goc';
                rv['insertTpl'] = '<span data-elg-name="goc"><i class="elg-icon egl-goc"></i> <input class="elg-input" type="text" required placeholder="ABC"></input></span>';
                break;
            case 'mat_phang':
                rv['displayName'] = 'Mặt phẳng';
                rv['iconName'] = 'egl-matphang';
                rv['insertTpl'] = '<span data-elg-name="mat_phang"><i class="elg-icon egl-matphang"></i> <input class="elg-input" type="text" required placeholder="ABC"></input></span>';
                break;
            case 'song_song':
                rv['displayName'] = 'Song song';
                rv['iconName'] = 'egl-songsong';
                rv['insertTpl'] = '<span data-elg-name="song_song"> <input class="elg-input" type="text" required placeholder="AB"></input><i class="elg-icon egl-songsong"></i> <input class="elg-input" type="text" required placeholder="CD"></input></span>';
                break;
        }
        return rv;
    });
    var keywordHandlers = {};
    for (var idx in keywordData) {
        keywordHandlers[keywordData[idx].name] = keywordData[idx];
    }

    function init() {
        $(".inputor").atwho({
            at: '@',
            displayTpl: "<li><i class='elg-icon ${iconName}'></i> ${displayName}</li>",
            insertTpl: "${insertTpl}",
            data: $.grep(keywordData, function(v) {
                return v.displayName !== "";
            })
        });

        $('.draw-btn').click(function() {
            $('.inputor').find('[data-elg-name]').each(function() {
                var $this = $(this),
                    myName = $this.data('elg-name');
                if (keywordHandlers.hasOwnProperty(myName) && keywordHandlers[myName].handlerFunction) {
                    switch (myName) {
                        case 'hinh_chop':
                            var shapeName = $.trim($this.find('input:eq(0)').val());
                            if (!shapeName) {
                                return;
                            }
                            var pyramid = keywordHandlers[myName].handlerFunction(shapeName, getRandomInt(0, 50), getRandomInt(0, 50), getRandomInt(50, 100), getRandomInt(50, 100), getRandomInt(100, 200));
                            scene.add(pyramid);
                            break;
                    }
                }
            })
        });

        //Set up three.js
        var canvas = document.getElementById('egl-canvas'),
            canvasWidth = 750,
            canvasHeight = 374;
        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(canvasWidth / -2, canvasWidth / 2, canvasHeight / 2, canvasHeight / -2, -300, 600);
        camera.position.set(200, 200, 100);
        camera.up = new THREE.Vector3(0, 0, 1);

        renderer = new THREE.CanvasRenderer({
            'alpha': true
        });
        renderer.setSize(canvasWidth, canvasHeight);
        canvas.appendChild(renderer.domElement);
        createGird();
        keywordHandlers['hinh_chop']['handlerFunction'] = createRectangularPyramid;
        animate();
    }


    function createRectangularPyramid(name, x, y, w, h, d) {
        var _name = name.split('.'),
            dinh = _name[0],
            day = _name[1].split(""),
            needCreate = false;
        if (day.length !== 4) {
            return "This is not rectangular pyramid";
        }
        if (!points.hasOwnProperty(dinh)) {
            needCreate = true;
            points[dinh] = {
                'obj': new THREE.Vector3(x + w / 2, y + h / 2, d),
                'shapes': []
            }
            // Draw label
	        var spritey = makeTextSprite(" " + dinh + " ", {
	            fontsize: 32,
	            backgroundColor: {
	                r: 255,
	                g: 100,
	                b: 100,
	                a: 1
	            }
	        });
	        var position = points[dinh].obj.clone().multiplyScalar(1);
	        spritey.position.set(position.x - 10, position.y -10, position.z); 
	        scene.add(spritey);
        }
        if (!points.hasOwnProperty(day[0])) {
            needCreate = true;
            points[day[0]] = {
                'obj': new THREE.Vector3(x, y, 0),
                'shapes': []
            }
        }
        if (!points.hasOwnProperty(day[1])) {
            needCreate = true;
            points[day[1]] = {
                'obj': new THREE.Vector3(x + w, y, 0),
                'shapes': []
            }
        }
        if (!points.hasOwnProperty(day[2])) {
            needCreate = true;
            points[day[2]] = {
                'obj': new THREE.Vector3(x + w, y + h, 0),
                'shapes': []
            }
        }
        if (!points.hasOwnProperty(day[3])) {
            needCreate = true;
            points[day[3]] = {
                'obj': new THREE.Vector3(x, y + h, 0),
                'shapes': []
            }
        }
        if (!needCreate) {
            return;
        }
        var geometry = new THREE.Geometry();

        geometry.dynamic = true;

        geometry.vertices.push(
            points[dinh].obj,
            points[day[0]].obj,

            points[dinh].obj,
            points[day[1]].obj,

            points[dinh].obj,
            points[day[2]].obj,

            points[dinh].obj,
            points[day[3]].obj,

            points[day[0]].obj,
            points[day[1]].obj,

            points[day[0]].obj,
            points[day[3]].obj,

            points[day[2]].obj,
            points[day[1]].obj,

            points[day[2]].obj,
            points[day[3]].obj
        );

        geometry.faces.push(new THREE.Face3(0, 1, 2));
        geometry.faces.push(new THREE.Face3(0, 2, 3));
        geometry.faces.push(new THREE.Face3(0, 3, 4));
        geometry.faces.push(new THREE.Face3(0, 1, 4));
        geometry.faces.push(new THREE.Face3(3, 1, 4));
        geometry.faces.push(new THREE.Face3(3, 2, 4));

        points[dinh].shapes.push(geometry);
        for (var idx in day) {
            points[day[idx]].shapes.push(geometry);
        }

        // var material = new THREE.MeshNormalMaterial({'wireframe': true});
        // var mesh = new THREE.Mesh(geometry, material);
        var material = new THREE.LineBasicMaterial({
            color: 0x000,
        });

        var line = new THREE.Line(geometry, material, THREE.LinePieces);
        return line;
    }

    function createGird() {
        // Grid

        var size = 200,
            step = 10;

        var geometry = new THREE.Geometry();

        for (var i = -size; i <= size; i += step) {

            geometry.vertices.push(new THREE.Vector3(-size, i, 0));
            geometry.vertices.push(new THREE.Vector3(size, i, 0));

            geometry.vertices.push(new THREE.Vector3(i, -size, 0));
            geometry.vertices.push(new THREE.Vector3(i, size, 0));

        }

        var material = new THREE.LineBasicMaterial({
            color: 0x000000,
            opacity: 0.2
        });

        var line = new THREE.Line(geometry, material, THREE.LinePieces);
        scene.add(line);
    }

    function createDemo() {
        var pyramid = createRectangularPyramid('S.ABCD', getRandomInt(0, 50), getRandomInt(0, 50), getRandomInt(50, 100), getRandomInt(50, 100), getRandomInt(100, 200));
        if (pyramid) {
            scene.add(pyramid);
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        var timer = Date.now() * 0.0001;
        camera.position.x = Math.cos(timer) * 200;
        camera.position.y = Math.sin(timer) * 200;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);

    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function makeTextSprite(message, parameters) {
        if (parameters === undefined) parameters = {};

        var fontface = parameters.hasOwnProperty("fontface") ?
            parameters["fontface"] : "Arial";

        var fontsize = parameters.hasOwnProperty("fontsize") ?
            parameters["fontsize"] : 18;

        var borderThickness = parameters.hasOwnProperty("borderThickness") ?
            parameters["borderThickness"] : 4;

        var borderColor = parameters.hasOwnProperty("borderColor") ?
            parameters["borderColor"] : {
                r: 0,
                g: 0,
                b: 0,
                a: 1.0
            };

        var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
            parameters["backgroundColor"] : {
                r: 255,
                g: 255,
                b: 255,
                a: 1.0
            };

        // var spriteAlignment = THREE.SpriteAlignment.topLeft;

        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        context.font = "Bold " + fontsize + "px " + fontface;

        // get size data (height depends only on font size)
        var metrics = context.measureText(message);
        var textWidth = metrics.width;

        // background color
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";

        context.lineWidth = borderThickness;
        roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q.

        // text color
        context.fillStyle = "rgba(0, 0, 0, 1.0)";

        context.fillText(message, borderThickness, fontsize + borderThickness);

        // canvas contents will be used for a texture
        var texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;

        var spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            useScreenCoordinates: false
        });
        var sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(100, 50, 1.0);
        return sprite;
    }

    function roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    init();

})
