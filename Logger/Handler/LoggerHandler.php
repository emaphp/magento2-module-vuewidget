<?php

namespace Vue\Widget\Logger\Handler;

/**
 * Logger handler
 */
class LoggerHandler extends \Magento\Framework\Logger\Handler\Base
{
    /**
     * Logging level
     *
     * @var int
     */
    protected $loggerType = \Monolog\Logger::DEBUG;

    /**
     * File name
     *
     * @var string
     */
    protected $fileName = '/var/log/vuewidget.log';

}
