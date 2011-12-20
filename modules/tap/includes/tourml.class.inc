<?php

class TourML {
    public $assets      = array();
    public $stops       = array();
    public $connections = array();

    public function processStops($nodes) {
        foreach($nodes as $node) {
            $this->processStop($node);
        }
        // Stops have been rendered, now render assets
        foreach($this->assets as $k => $asset) {
            $this->assets[$k] = theme('tap_tourml_asset', array('asset' => $asset));
        }
    }

    protected function processStop($node) {
        node_build_content($node, 'tourml_xml');
        $stop['id']         = $node->nid;
        $stop['items'][]    = theme('tap_tourml_title_text', array('items' => array(array('value' => $node->title)))); //TODO: needs discussion
        foreach(element_children($node->content) as $field_name) {
            $field =& $node->content[$field_name];

            if (isset($field['#formatter']) && strpos($field['#formatter'], 'tap_tourml') !== false)
            {
                switch($field['#formatter'])
                {
                    case 'tap_tourml_property':
                        $properties[] = drupal_render($field);
                        break;
                    case 'tap_tourml_asset':
                        foreach($field['#items'] as $item) {
                            if (!isset($this->assets[$item['fid']])) {
                                $this->assets[$item['fid']] = $item;
                            }
                            $stop['items'][] = drupal_render($field);
                        }
                        break;
                    case 'tap_tourml_connection':
                        $ConnectionPriority = 0;
                        foreach($field['#items'] as $k => $v)
                        {
                            $field['#items'][$k]['priority'] = ++$ConnectionPriority;
                            $field['#items'][$k]['srcId'] = $node->nid;
                        }
                        $this->connections[] = drupal_render($field);
                        break;
                    case 'tap_tourml_description':
                        $stop['items'][] = drupal_render($field);
                        break;
                }

            }
        }

        $stop['items'][]    = theme('tap_tourml_property_set', array('properties' => $properties));
        $this->stops[]      = theme('tap_tourml_stop', $stop);
    }
}