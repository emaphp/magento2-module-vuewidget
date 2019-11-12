<?php

namespace Vue\Widget\Block\Widget;

use Magento\Framework\View\Element\Template;
use Magento\Widget\Block\BlockInterface;
use Vue\Widget\Logger\Logger;

class VueWidget extends Template implements BlockInterface {
    protected static $_counter = 1;
    protected $logger;

    public static function _getId() {
        return '__vue-widget--' . self::$_counter++;
    }

    public function __construct(
        Template\Context $context,
        Logger $logger,
        array $data = []
    ) {
        $this->logger = $logger;
        parent::__construct($context, $data);
        $this->setTemplate('widget.phtml');
    }

    public function getWidgetId() {
        return self::_getId();
    }

    public function getWidgetName() {
        return $this->getData('component');
    }

    public function getWidgetProps() {
        return $this->getData('props');
    }
}
