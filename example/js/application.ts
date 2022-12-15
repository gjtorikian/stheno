// src/application.js
import { Application } from "@hotwired/stimulus"

import SthenoController from "./controllers/stheno_controller"

window.Stimulus = Application.start()
Stimulus.register("stheno", SthenoController)
