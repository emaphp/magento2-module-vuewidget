<?php

namespace Vue\Widget\Block\Adminhtml\Widget\Type;

use Vue\Widget\Logger\Logger;

class Props extends \Magento\Backend\Block\Template
{
    protected $logger;
    protected $elementFactory;

    /**
     * @param \Magento\Backend\Block\Template\Context $context
     * @param \Magento\Framework\Data\Form\Element\Factory $elementFactory
     * @param array $data
     */
    public function __construct(
        \Magento\Backend\Block\Template\Context $context,
        \Magento\Framework\Data\Form\Element\Factory $elementFactory,
        Logger $logger,
        array $data = []
    ) {
        $this->elementFactory = $elementFactory;
        $this->logger = $logger;

        parent::__construct($context, $data);
    }

    /**
     * Prepare chooser element HTML
     *
     * @param \Magento\Framework\Data\Form\Element\AbstractElement $element Form Element
     * @return \Magento\Framework\Data\Form\Element\AbstractElement
     */
    public function prepareElementHtml(\Magento\Framework\Data\Form\Element\AbstractElement $element)
    {
        $layout = $this->getLayout();
        $block = $layout->createBlock('Magento\Framework\View\Element\Template')->setTemplate('Vue_Widget::props.phtml');

        $block->setData('field_id', $element->getData('html_id'));
        $block->setData('field_name', $element->getData('name'));
        $block->setData('props', $element->getData('value') ?? [], JSON_FORCE_OBJECT);

        $element->setData('after_element_html', $block->toHtml());
        $element->setValue(''); // Hides the additional label that gets added.
        return $element;
    }
}
