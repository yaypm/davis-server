'use strict';

const router = require('express').Router();

router.route('/')
  // returns all the current configuration values
  .get((req, res) => {
    const davis = req.app.get('davis');
    const filters = davis.filters;

    filters.getFilters()
      .then((data) => {
        res.send({ success: true, filters: data });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  })

  .post((req, res) => {
    const davis = req.app.get('davis');
    const filters = davis.filters;

    filters.createFilter(req.body)
      .then(() => {
        res.send({ success: true, message: 'The filter was created successfully.' });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  });


router.route('/:id')
  .get((req, res) => {
    const davis = req.app.get('davis');
    const filters = davis.filters;
    const id = req.params.id;

    filters.getFilter(id)
      .then((data) => {
        res.send({ success: true, filter: data });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  })

  .put((req, res) => {
    const davis = req.app.get('davis');
    const filters = davis.filters;
    const id = req.params.id;

    filters.updateFilter(id, req.body)
      .then(() => {
        res.send({ success: true, message: 'The filter has been successfully updated.' });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  })

  .delete((req, res) => {
    const davis = req.app.get('davis');
    const filters = davis.filters;
    const id = req.params.id;

    filters.deleteFilter(id)
      .then(() => {
        res.send({ success: true, message: 'The filter has been successfully removed.' });
      })
      .catch((err) => {
        res.send({ success: false, message: err.message });
      });
  });

module.exports = router;
