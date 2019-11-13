<?php

namespace Vue\Widget\Model\Widget;

class Instance extends \Magento\Widget\Model\Widget\Instance {
    /**
     * Generate layout update xml
     *
     * @param string $container
     * @param string $templatePath
     * @return string
     * @SuppressWarnings(PHPMD.CyclomaticComplexity)
     * @SuppressWarnings(PHPMD.NPathComplexity)
     */
    public function generateLayoutUpdateXml($container, $templatePath = '')
    {
        $templateFilename = $this->_viewFileSystem->getTemplateFileName(
            $templatePath,
            [
                'area' => $this->getArea(),
                'themeId' => $this->getThemeId(),
                'module' => \Magento\Framework\View\Element\AbstractBlock::extractModuleName($this->getType())
            ]
        );
        if (!$this->getId() && !$this->isCompleteToCreate() || $templatePath && !is_readable($templateFilename)) {
            return '';
        }
        $parameters = $this->getWidgetParameters();
        $xml = '<body><referenceContainer name="' . $container . '">';
        $template = '';
        if (isset($parameters['template'])) {
            unset($parameters['template']);
        }
        if ($templatePath) {
            $template = ' template="' . $templatePath . '"';
        }

        $hash = $this->mathRandom->getUniqueHash();
        $xml .= '<block class="' . $this->getType() . '" name="' . $hash . '"' . $template . '>';
        foreach ($parameters as $name => $value) {
            if ($name == 'conditions') {
                $name = 'conditions_encoded';
                $value = $this->conditionsHelper->encode($value);
            }
            if ($name) {
                if (is_array($value)) {
                    $values = '';

                    foreach ($value as $pname => $pvalue) {
                        $values .= '<item name="' .
                                $this->_escaper->escapeHtml(
                                    $pname
                                ) .
                                '" xsi:type="string">' .
                                $this->_escaper->escapeHtml(
                                    $pvalue
                                ) .
                                '</item>';
                    }

                    $xml .= '<action method="setData">' .
                         '<argument name="name" xsi:type="string">' .
                         $name .
                         '</argument>' .
                         '<argument name="value" xsi:type="array">' .
                         $values .
                         '</argument>' . '</action>';
                } elseif (strlen((string)$value)) {
                    $value = html_entity_decode($value);
                    $xml .= '<action method="setData">' .
                         '<argument name="name" xsi:type="string">' .
                         $name .
                         '</argument>' .
                         '<argument name="value" xsi:type="string">' .
                         $this->_escaper->escapeHtml(
                             $value
                         ) . '</argument>' . '</action>';
                }
            }
        }
        $xml .= '</block></referenceContainer></body>';

        return $xml;
    }
}
