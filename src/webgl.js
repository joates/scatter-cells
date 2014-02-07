var domready = require('domready')
  ,      raf = require('raf')
  ,    THREE = require('./three-r65')
  ,     cell = require('./Particle')
  ,       PS = require('./ParticleSystem').create()

  , width     = window.innerWidth
  , height    = window.innerHeight

  , scene     = new THREE.Scene()
  , light     = new THREE.PointLight(0xffffff, 2, 3000)
  , camera    = new THREE.PerspectiveCamera(40, width / height, 0.1, 10000)
  , mesh      = new THREE.Mesh(
                  new THREE.CylinderGeometry(20, 20, 12, 20)
                , new THREE.MeshLambertMaterial({ color: 0xff9000 })
                )

module.exports = {

  renderer:   new THREE.WebGLRenderer({ antialias: false })

  , init:     function(qty, cb) {
                var self = this
                process.nextTick(function() {
                  domready(function() {
                    scene.add(PS)
                    scene.add(light)
                    scene.add(new THREE.AmbientLight(0x202020))
                    var num = qty
                    while (--num) {
                      var randomColor = Math.random() * 0.5
                        , r = randomColor + 0.3
                        , g = randomColor + 0.6
                        , b = randomColor + 0.9
                        , color = new THREE.Color().setRGB(r,g,b)
                        , clone = cell.create(mesh)
                      clone.scale = new THREE.Vector3(1,0.2,1).multiplyScalar(Math.random()*1.75+1.25)
                      clone.material = new THREE.MeshLambertMaterial({ color: color })  // Note: explicitly passed by value.
                      clone.position.set(Math.cos(num)*qty, -1, Math.sin(num)*qty)
                      clone.position.setLength(10 + Math.random()*20)
                      PS.add(clone)
                    }
                    camera.position.set(0, 500, 1500)
                    self.renderer.setSize(width, height)
                    document.body.appendChild(self.renderer.domElement)
                    window.addEventListener('resize', self.resize.bind(self), false)

                    // animation.
                    raf(self.renderer.domElement).on('data', function(dt) {
                      self.update(dt)
                      self.render()
                    })

                    // async response.
                    cb(!scene instanceof THREE.Scene, scene)
                  })
                })
              }

  , update:   function(t) {  // (Note: delta time is not used !!)

                var numAgitatedParticles = PS.updateCells()

                // manage collective forces.
                PS.equilibrium = PS.updateForces(numAgitatedParticles)

                if (!PS.equilibrium) {

                  // iteratate through each particle
                  // and update it's position within the particle system.
                  PS.children.forEach(function(cell) { cell.update() })
                }

                // move the camera.
                var x, y, z, speed = 0.002
                x = camera.position.x
                y = camera.position.y
                z = camera.position.z
                camera.position.x = x * Math.cos(speed) - z * Math.sin(speed)
                camera.position.z = z * Math.cos(speed) + x * Math.sin(speed)
                light.position = camera.position
                camera.lookAt(scene.position)
              }

  , render:   function() {
                this.renderer.render(scene, camera)
              }

  , resize:   function() {
                width  = window.innerWidth
                height = window.innerHeight
                this.renderer.setSize(width, height)
                camera.aspect = width / height
                camera.updateProjectionMatrix()
              }

}
