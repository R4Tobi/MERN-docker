const si = require('systeminformation');
/**
 * Provides system information related to CPU temperature.
 */
class SystemInfo {
    constructor(){
        si.getStaticData().then(data => this.static = data);
    }

    /**
     * Retrieves the CPU temperature.
     * @returns {string} The CPU temperature in degrees Celsius.
     */
    getCPUTemp() {
        return si.cpuTemperature().then(data => `${data.main} °C`);
    }

    /**
    * Retrieves the CPU usage.
    * @returns {string} The CPU usage as a percentage.
    */
    getCPUUsage() {
        return si.currentLoad().then(data => `${data.currentLoad}%`);
    }

    /**
    * Retrieves Clock Speed of CPU
    * @returns {string} Average Speed of all cores i MHz
    */
    getCPUSpeed(){
        return si.cpuCurrentSpeed().then(data => `${data.avg} MHz`)
    }

    /**
     * Retrieves the RAM usage.
     * @returns {string} The RAM usage as a percentage.
     */
    getRAMUsage() {
        return si.mem().then(data => `${data.used / data.total * 100}%`);
    }

    /**
     * Retrieves the Usage Conclusion.
     * @returns {Object} with retrieved Informations     */
    getConclusion() {
        return {
            cpuTemp: this.getCPUTemp(),
            cpuLoad: this.getCPUUsage(),
            ramLoad: this.getRAMUsage(),
            static: this.static,
        }
    }
}

module.exports = SystemInfo;