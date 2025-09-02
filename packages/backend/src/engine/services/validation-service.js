/**
 * ValidationService - Pre-execution validation logic
 *
 * Bu servis workflow çalıştırılmadan önce gerekli kontrolleri yapar:
 * - Cloud/subscription limitleri
 * - User yetkileri
 * - Flow durumu
 */
class ValidationService {
  /**
   * Flow execution için tüm validasyonları çalıştırır
   * @param {Object} flow - Flow instance
   * @param {boolean} testRun - Test modunda mı çalışıyor
   * @returns {Promise<boolean>} - Validation başarılı mı
   */
  async validateFlowExecution(flow, testRun) {
    // Test modunda limit kontrolü yapma
    if (testRun) {
      return true;
    }

    // Cloud limitlerini kontrol et
    const { isAllowedToRunFlows } = await this.checkCloudLimits(flow);

    if (!isAllowedToRunFlows) {
      // Log veya metric eklenebilir
      return false;
    }

    return true;
  }

  /**
   * Cloud/subscription limitlerini kontrol eder
   * @param {Object} flow - Flow instance
   * @returns {Promise<Object>} - Limit kontrol sonuçları
   */
  async checkCloudLimits(flow) {
    const user = await flow.$relatedQuery('user');
    const isAllowedToRunFlows = await user.isAllowedToRunFlows();

    return {
      isAllowedToRunFlows,
      user, // İleride kullanılabilir
    };
  }

  /**
   * Flow'un aktif olup olmadığını kontrol eder
   * @param {Object} flow - Flow instance
   * @returns {boolean} - Flow aktif mi
   */
  isFlowActive(flow) {
    return flow.active === true;
  }

  /**
   * Flow'un test edilebilir olup olmadığını kontrol eder
   * @param {Object} flow - Flow instance
   * @returns {boolean} - Flow test edilebilir mi
   */
  canTestFlow(flow) {
    // İleride test koşulları eklenebilir
    return true;
  }
}

export default ValidationService;
