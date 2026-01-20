/**
 * Утилита для валидации SVG кода
 */

/**
 * Базовая проверка на наличие SVG тега в строке
 * @param svgCode - строка с SVG кодом
 * @returns true если содержит <svg> тег, false иначе
 */
export function isValidSvg(svgCode: string): boolean {
  if (!svgCode || typeof svgCode !== 'string') {
    return false;
  }

  // Базовая проверка на наличие <svg> тега
  const svgTagRegex = /<svg[\s>]/i;
  return svgTagRegex.test(svgCode.trim());
}

/**
 * Проверяет, является ли строка валидным SVG кодом
 * @param svgCode - строка с SVG кодом
 * @returns объект с результатом валидации и сообщением об ошибке
 */
export function validateSvg(svgCode: string): {
  isValid: boolean;
  error?: string;
} {
  if (!svgCode || !svgCode.trim()) {
    return {
      isValid: false,
      error: 'SVG код не может быть пустым',
    };
  }

  if (!isValidSvg(svgCode)) {
    return {
      isValid: false,
      error: 'SVG код должен содержать тег <svg>',
    };
  }

  return {
    isValid: true,
  };
}
